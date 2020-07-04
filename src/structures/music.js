// eslint-disable-next-line max-classes-per-file
const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core-discord');
const ytpl = require('ytpl');
const request = require('node-superfetch');
const moment = require('moment');
const paginationEmbed = require('discord.js-pagination');
require('moment-duration-format');

module.exports = class MusicClient {
  constructor(client, options) {
    this.client = client;
    this.apiKey = options && options.apiKey;
    this.defVolume = (options && options.defVolume) || 50;
    this.bitRate = (options && options.bitRate) || 'auto';
    this.maxHistory = (options && options.maxHistory) || 50;
    this.maxQueue = (options && options.maxQueue) || 500;
    this.searchFilters = options && options.searchFilters;
    this.color = (options && options.color) || 13632027;
    this.logger = (options && options.logger) || console;
    this.autoLeaveIn = (options && options.autoLeaveIn) || 5 * 60 * 1000;
    this.guilds = new Map();
    this.searchFiltersEnabled = !!this.searchFilters;
    this.timeout = null;
  }

  static get queueMode() {
    return {
      NORMAL: 'n',
      REPEAT_ALL: 'ra',
      REPEAT_ONE: 'ro',
    };
  }

  static get noteType() {
    return {
      ERROR: 'error',
      INFO: 'info',
      MUSIC: 'music',
      SEARCH: 'search',
    };
  }

  static song() {
    return {
      id: '',
      title: '',
      uploader: '',
      uploaderURL: '',
      requester: '',
      requesterAvatarURL: '',
      url: '',
      duration: '',
    };
  }

  async getGuild(guildId) {
    const guildData = await this.client.findGuild({ id: guildId }, true);
    if (!this.guilds.has(guildId)) {
      this.guilds.set(guildId, {
        id: guildId,
        audioDispatcher: null,
        queue: [],
        history: [],
        mode: MusicClient.queueMode.NORMAL,
        volume: guildData.plugins.music.volume || this.defVolume,
      });
    }
    const guild = this.guilds.get(guildId);
    return guild;
  }

  getCurrentSong(guild) {
    return guild.history[0];
  }

  getNextSong(guild) {
    if (guild.queue.length > 0) {
      const song = guild.queue[0];
      if (guild.mode === MusicClient.queueMode.NORMAL) {
        guild.queue.shift();
      } else if (guild.mode === MusicClient.queueMode.REPEAT_ALL) {
        guild.queue.shift();
        guild.queue.push(song);
      }
      return song;
    }
  }

  addSongToHistory(guild, song) {
    if (guild.history[0] !== song) {
      guild.history.unshift(song);
      while (guild.history.length > this.maxHistory) guild.history.pop();
    }
  }

  async playStream(song, msg, volume, seek = 0) {
    const conn = await this.getVoiceConnection(msg);
    const info = await ytdl.getBasicInfo(song.url);
    const isLive = info.player_response.videoDetails.isLiveContent && info.player_response.videoDetails.isLive;
    const options = {
      filter: 'audioonly',
      quality: 'highestaudio',
      // eslint-disable-next-line no-bitwise
      highWaterMark: 1 << 25,
    };
    if (isLive) {
      options.begin = Date.now();
    }
    return conn.play(await ytdl(song.url, options), {
      bitrate: this.bitRate,
      passes: 3,
      seek,
      volume: volume / 100,
      type: 'opus',
      highWaterMark: 1,
    });
  }

  async playNow(guild, song, msg) {
    try {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      guild.audioDispatcher = await this.playStream(song, msg, guild.volume);
      this.addSongToHistory(guild, song);
      guild.audioDispatcher.on('finish', () => this.playNext(guild, msg));
      guild.audioDispatcher.on('error', (error) => this.note(error, msg, MusicClient.noteType.ERROR));
      await this.displaySong(guild, msg, song);
      this.logger.info(`[PLAYER] Playing SONG_URL:${song.url} SERVERID:${guild.id}`);
    } catch (error) {
      await this.note(msg, error, MusicClient.noteType.ERROR);
      this.logger.error(`[PLAYER] ${error.stack}`);
      await this.playNext(guild, msg);
    }
  }

  async playNext(guild, msg) {
    try {
      const song = this.getNextSong(guild);
      if (song) return this.playNow(guild, song, msg);
      await this.stop(guild, msg, false);
      if (this.autoLeaveIn !== 0) {
        this.timeout = setTimeout(() => this.disconnectVoiceConnection(msg), this.autoLeaveIn);
      }
      await this.note(msg, 'Queue is empty, playback finished.', MusicClient.noteType.MUSIC);
    } catch (error) {
      this.disconnectVoiceConnection(msg);
    }
  }

  async stop(guild, msg, displayNote = true) {
    if (!guild.audioDispatcher && displayNote) {
      return this.note(msg, 'Nothing playing right now.', MusicClient.noteType.ERROR);
    }
    guild.audioDispatcher.pause();
    guild.audioDispatcher.destroy();
    guild.audioDispatcher = null;
    if (displayNote) return this.note(msg, 'Playback stopped.', MusicClient.noteType.MUSIC);
  }

  async getVoiceConnection(msg, force = false) {
    if (!msg.guild) throw new Error('Unable to find discord server.');
    const voiceChannel = msg.member.voice.channel;
    const voiceConnection = this.client.voice.connections.find((val) => val.channel.guild.id === msg.guild.id);
    if (!voiceConnection || force) {
      if (voiceChannel && voiceChannel.joinable) return await voiceChannel.join();
      throw new Error('Unable to join your voice channel.');
    }
    return voiceConnection;
  }

  disconnectVoiceConnection(msg) {
    this.client.voice.connections.forEach((conn) => {
      if (conn.channel.guild.id === msg.guild.id) conn.disconnect();
    });
  }

  async getSongViaUrl(url) {
    const info = await ytdl.getBasicInfo(url);
    const song = MusicClient.song();
    song.id = info.video_id;
    song.title = info.title;
    song.url = info.video_url;
    song.uploader = info.author.name;
    song.uploaderURL = info.author.channel_url;
    song.duration = moment.duration(parseInt(info.length_seconds), 'seconds').format();
    return [song];
  }

  async getSongsViaSpotifyPlaylist(url, offset = 0) {
    const playId = url.toString().split('/playlist/')[1].split('?')[0];
    const tracks = await this.client.spotify.request(`https://api.spotify.com/v1/playlists/${playId}/tracks?offset=${offset}&limit=5`);
    const trackArray = tracks.items.map((track) => [track.track.artists[0].name, track.track.name]);

    const finalTracks = await this.getSongsViaSearchQuery(`${trackArray[0][0]} - ${trackArray[0][1]}`);
  }

  async getSongsViaPlaylistUrl(url) {
    const playId = url.toString().split('list=')[1];
    const playlist = await ytpl(playId);
    if (playlist.items.length < 1) throw new Error('Couldn\'t get any songs from that playlist.');
    const songs = [];
    for (const info of playlist.items) {
      const song = MusicClient.song();
      song.id = info.id;
      song.title = info.title;
      song.url = info.url_simple;
      song.uploader = info.author.name;
      song.uploaderURL = info.author.ref;
      song.duration = info.duration;
      songs.push(song);
    }
    return songs;
  }

  async filterSong(songs, query) {
    let exclude = this.searchFilters;
    exclude = exclude.filter((term) => !query.includes(term));
    let hit = songs[0];
    songs.reverse().forEach((song) => {
      if (!new RegExp(exclude.join('|'), 'u').test(song.title.trim().toLowerCase())) hit = song;
    });
    return hit;
  }

  async getSongsViaSearchQuery(query) {
    const searchString = query.trim();
    const { body, error } = await request.get('https://www.googleapis.com/youtube/v3/search').query({
      part: 'snippet',
      type: 'video',
      maxResults: this.searchFiltersEnabled && this.searchFilters ? 5 : 1,
      q: searchString,
      key: this.apiKey,
    });
    if (!body.items.length || error) throw new Error(`No results for query: "${searchString}".`);
    const songs = [];
    for (const info of body.items) {
      const song = MusicClient.song();
      song.id = info.id.videoId;
      song.title = info.snippet.title;
      song.url = `https://www.youtube.com/watch?v=${info.id.videoId}`;
      song.uploader = info.snippet.channelTitle;
      song.uploaderURL = `https://www.youtube.com/channel/${info.snippet.channelId}`;
      song.duration = moment
        // eslint-disable-next-line no-await-in-loop
        .duration(parseInt((await ytdl.getBasicInfo(song.url)).length_seconds), 'seconds')
        .format();
      songs.push(song);
    }
    if (this.searchFiltersEnabled && this.searchFilters && songs.length > 0) {
      return [await this.filterSong(songs, searchString)];
    }
    return [songs[0]];
  }

  async search(msg, query) {
    let searchString = query.trim();
    let songs = [];
    let note;
    if (searchString.includes('youtu.be/') || searchString.includes('youtube.com/')) {
      // eslint-disable-next-line prefer-destructuring
      if (searchString.includes('&')) searchString = searchString.split('&')[0];
      if (searchString.includes('watch') || searchString.includes('youtu.be/')) {
        note = await this.note(msg, 'Hunting down the link audio', MusicClient.noteType.SEARCH);
        songs = await this.getSongViaUrl(searchString);
      } else if (searchString.includes('playlist')) {
        note = await this.note(msg, 'Adding all the songs in the playlist', MusicClient.noteType.SEARCH);
        songs = await this.getSongsViaPlaylistUrl(searchString);
      }
    } else if (searchString.includes('/playlist/') && searchString.includes('spotify')) {
      note = await this.note(msg, 'Searching spotify...', MusicClient.noteType.SEARCH);
      songs = await this.getSongsViaSpotifyPlaylist(searchString);
    } else {
      note = await this.note(msg, 'Scouting the web', MusicClient.noteType.SEARCH);
      songs = await this.getSongsViaSearchQuery(query);
    }
    note.delete({ timeout: 3000 });
    return songs;
  }

  async displaySong(guild, msg, song) {
    if (!msg.channel) throw new Error('Channel is inaccessible.');
    let repeatMode = 'Disabled';
    if (guild.mode === MusicClient.queueMode.REPEAT_ALL) repeatMode = 'All';
    if (guild.mode === MusicClient.queueMode.REPEAT_ONE) repeatMode = 'One';
    const embed = new MessageEmbed()
      .setAuthor('Now Playing', this.client.user.displayAvatarURL())
      .setThumbnail(`https://img.youtube.com/vi/${song.id}/maxresdefault.jpg`)
      .setColor(this.color)
      .addField('Title', `[${song.title}](${song.url})`)
      .addField('Uploader', `[${song.uploader}](${song.uploaderURL})`, true)
      .addField('Length', `${song.duration}`, true)
      .addField('Requester', `<@${song.requester}>`, true)
      .addField('Volume', `${guild.audioDispatcher.volume * 100}%`, true)
      .addField('Repeat', `${repeatMode}`, true);
    const songDisplay = await msg.channel.send(embed);
    const emojiList = ['⏪', '⏯', '⏩', '⏹'];
    // eslint-disable-next-line no-await-in-loop
    for (const emoji of emojiList) await songDisplay.react(emoji);
    const reactionCollector = songDisplay.createReactionCollector(
      (reaction, user) => emojiList.includes(reaction.emoji.name) && !user.bot,
      { time: 60000 },
    );
    reactionCollector.on('collect', (reaction, user) => {
      const botVoice = reaction.message.guild.me.voice.channel;
      const member = this.client.guilds.cache.get(reaction.message.guild.id).members.cache.get(user.id);
      if (!member || !botVoice) { return; }
      if (member.voice.channel.id !== botVoice.id) { return; }
      if (!member.hasPermission('MANAGE_CHANNELS') && !member.roles.cache.find((role) => role.name.toLowerCase() === 'dj')) { return; }
      switch (reaction.emoji.name) {
        case '⏪':
          this.previousFunction(msg);
          break;
        case '⏯':
          if (guild.audioDispatcher.paused) this.resumeFunction(msg);
          else this.pauseFunction(msg);
          break;
        case '⏩':
          this.skipFunction(msg);
          break;
        case '⏹':
          this.stopFunction(msg);
          break;
        default:
          break;
      }
    });
    reactionCollector.on('end', () => songDisplay.reactions.removeAll());
  }

  async note(msg, text, type) {
    if (!msg.channel) throw new Error('Channel is inaccessible.');
    const embed = new MessageEmbed().setColor(this.color);
    switch (type) {
      case MusicClient.noteType.INFO:
        return await msg.channel.send(embed.setDescription(`:information_source:  ${text}  :information_source:`));
      case MusicClient.noteType.MUSIC:
        return await msg.channel.send(embed.setDescription(`:musical_note:  ${text}  :musical_note:`));
      case MusicClient.noteType.SEARCH:
        return await msg.channel.send(embed.setDescription(`:mag:  ${text}  :mag:`));
      case MusicClient.noteType.ERROR:
        return await msg.channel.send(embed.setDescription(`:warning:  ${text}  :warning:`));
      default:
        return await msg.channel.send(embed.setDescription(`${text}`));
    }
  }

  async pageEmbed(_title, _isField, _extraTitle, _extraText) {
    class pageEmbed extends MessageEmbed {
      constructor(title, avatarURL, color, isField = false, extraTitle, extraText) {
        super();
        this.setAuthor(title, avatarURL);
        this.setColor(color);
        if (extraTitle) this.addField(extraTitle, extraText);
        this.isField = isField;
      }

      addContent(title, text) {
        !this.isField ? this.setDescription(text) : this.addField(title, text);
      }
    }
    const avatarURL = this.client.user.displayAvatarURL();
    // eslint-disable-next-line new-cap
    return new pageEmbed(_title, avatarURL, this.color, _isField, _extraTitle, _extraText);
  }

  async pageBuilder(title, list, pageLimit, isField, extraTitle, extraText) {
    const pages = [];
    if (list.length < 1) {
      const pageEmbed = this.pageEmbed(title, isField, extraTitle, extraText);
      pageEmbed.addContent(title, `${title} is empty.`);
      pages.push(pageEmbed);
    }
    for (let i = 0; i < list.length; i += pageLimit) {
      let text = '';
      const pageEmbed = this.pageEmbed(title, isField, extraTitle, extraText);
      list.slice(i, i + pageLimit).forEach((entry, index) => {
        text += `${i + index + 1}. [${entry.title}](${entry.url})\n*Queued by: <@${entry.requester}>*\n`;
      });
      pageEmbed.addContent(title, text);
      pages.push(pageEmbed);
    }
    return pages;
  }

  async playFunction(msg, query, force = false) {
    if (!query) return this.note(msg, 'You need to provide a query!', MusicClient.noteType.ERROR);
    const guild = await this.getGuild(msg.guild.id);
    const voiceChannel = msg.member.voice.channel;
    if (!voiceChannel) return this.note(msg, 'You have to be in a voice channel to use this command.', MusicClient.noteType.ERROR);
    try {
      let songs = await this.search(msg, query);
      if (songs.length + guild.queue.length > this.maxQueue) {
        if (songs.length === 1) return this.note(msg, 'You filled the queue!', MusicClient.noteType.ERROR);
        (await this.note(msg, 'Playlist is being shortened.', MusicClient.noteType.ERROR)).delete({
          timeout: 3000,
        });
        songs = songs.slice(0, this.maxQueue - guild.queue.length);
      }
      // eslint-disable-next-line no-restricted-syntax
      for (const song of songs) {
        song.requester = msg.author.id;
        song.requesterAvatarURL = msg.author.displayAvatarURL();
      }
      if (force) {
        guild.queue.unshift(guild.history[0], ...songs);
        guild.audioDispatcher.end();
      } else {
        guild.queue = guild.queue.concat(songs);
      }
      if (songs.length > 1) {
        await this.note(msg, `Added ${songs.length} songs to the queue!`, MusicClient.noteType.MUSIC);
      } else {
        await this.note(msg, `Added to song queue: [${songs[0].title}](${songs[0].url})`, MusicClient.noteType.MUSIC);
      }
      if (!guild.audioDispatcher) this.playNext(guild, msg);
    } catch (error) {
      await this.note(msg, error, MusicClient.noteType.ERROR);
    }
  }

  async clearFunction(msg) {
    const guild = await this.getGuild(msg.guild.id);
    guild.queue = [];
    await this.note(msg, 'Emptied the queue.', MusicClient.noteType.MUSIC);
  }

  async joinFunction(msg) {
    this.logger.info(`[COMMAND] TYPE:JOIN AUTHOR_ID:${msg.author.id} SERVERID:${msg.guild.id}`);
    const voiceChannel = msg.member.voice.channel;
    if (!voiceChannel) return this.note(msg, 'Must be in a voice channel.', MusicClient.noteType.ERROR);
    await this.getVoiceConnection(msg, true);
    await this.note(msg, 'Joining voice channel.', MusicClient.noteType.MUSIC);
  }

  async leaveFunction(msg) {
    const voiceConnection = this.client.voice.connections.find((val) => val.channel.guild.id === msg.guild.id);
    if (!voiceConnection) return this.note(msg, 'Not in a voice channel.', MusicClient.noteType.ERROR);
    const guild = await this.getGuild(msg.guild.id);
    await this.stop(guild, msg);
    this.disconnectVoiceConnection(msg);
    await this.note(msg, 'Leaving voice channel.', MusicClient.noteType.MUSIC);
  }

  async nowPlayingFunction(msg) {
    const guild = await this.getGuild(msg.guild.id);
    if (!guild.audioDispatcher) return this.note(msg, 'Nothing playing right now.', MusicClient.noteType.ERROR);
    await this.displaySong(guild, msg, this.getCurrentSong(guild));
  }

  async pauseFunction(msg) {
    this.logger.info(`[COMMAND] TYPE:PAUSE AUTHOR_ID:${msg.author.id} SERVERID:${msg.guild.id}`);
    const guild = await this.getGuild(msg.guild.id);
    if (!guild.audioDispatcher) {
      await this.note(msg, 'There isn\'t any music playing!', MusicClient.noteType.ERROR);
    } else if (guild.audioDispatcher.paused) {
      await this.note(msg, 'The music is already paused...', MusicClient.noteType.ERROR);
    } else {
      guild.audioDispatcher.pause(true);
      await this.note(msg, 'Paused playback.', MusicClient.noteType.MUSIC);
    }
  }

  async resumeFunction(msg) {
    const guild = await this.getGuild(msg.guild.id);
    if (!guild.audioDispatcher) {
      await this.note(msg, 'The queue is empty and nothing is playing.', MusicClient.noteType.ERROR);
    } else if (!guild.audioDispatcher.paused) {
      await this.note(msg, 'Music already playing.', MusicClient.noteType.ERROR);
    } else {
      guild.audioDispatcher.resume();
      await this.note(msg, 'Playback resumed.', MusicClient.noteType.MUSIC);
    }
  }

  async stopFunction(msg) {
    const guild = await this.getGuild(msg.guild.id);
    await this.stop(guild, msg);
    guild.queue = [];
    await this.note(msg, 'Queue is now empty.', MusicClient.noteType.MUSIC);
  }

  async repeatFunction(msg, mode) {
    const guild = await this.getGuild(msg.guild.id);
    switch (mode.trim().toLowerCase()) {
      case 'one':
        if (guild.queue[0] !== guild.history[0]) guild.queue.unshift(guild.history[0]);
        guild.mode = MusicClient.queueMode.REPEAT_ONE;
        return this.note(msg, 'Repeat: One', MusicClient.noteType.MUSIC);
      case 'all':
        if (guild.queue[guild.queue.length - 1] !== guild.history[0]) guild.queue.push(guild.history[0]);
        guild.mode = MusicClient.queueMode.REPEAT_ALL;
        return this.note(msg, 'Repeat: All', MusicClient.noteType.MUSIC);
      case 'off':
        guild.mode = MusicClient.queueMode.NORMAL;
        return this.note(msg, 'Repeat: Disabled', MusicClient.noteType.MUSIC);
      default:
        return this.note(msg, 'Invalid argument.', MusicClient.noteType.ERROR);
    }
  }

  async removeFunction(msg, songIndex) {
    this.logger.info(
      `[COMMAND] TYPE:REMOVE INDEX:${songIndex} AUTHOR_ID:${msg.author.id} SERVERID:${msg.guild.id}`,
    );
    if (!songIndex) return this.note(msg, 'Provide the queue position.', MusicClient.noteType.ERROR);
    const index = songIndex - 1;
    const guild = await this.getGuild(msg.guild.id);
    if (index < 0 || index >= guild.queue.length) {
      return this.note(msg, 'There is no song in that position!', MusicClient.noteType.ERROR);
    }
    const song = guild.queue[index];
    guild.queue.splice(index, 1);
    this.logger.info('[QUEUE] Removed 1 song.');
    return this.note(msg, `[${song.title}](${song.url}) was removed from the queue by ${msg.author.username}!`, MusicClient.noteType.MUSIC);
  }

  async shuffleFunction(msg) {
    this.logger.info(`[COMMAND] TYPE:SHUFFLE AUTHOR_ID:${msg.author.id} SERVERID:${msg.guild.id}`);
    const guild = await this.getGuild(msg.guild.id);
    if (guild.queue.length < 1) return this.note(msg, 'Queue is empty.', MusicClient.noteType.ERROR);
    for (let i = guild.queue.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [guild.queue[i], guild.queue[j]] = [guild.queue[j], guild.queue[i]];
    }
    await this.note(msg, 'Shufflin\' it up.', MusicClient.noteType.MUSIC);
  }

  async previousFunction(msg) {
    const guild = await this.getGuild(msg.guild.id);
    if (!guild.audioDispatcher) return this.note(msg, 'Nothing playing right now.', MusicClient.noteType.ERROR);
    await this.note(msg, 'Previous song.', MusicClient.noteType.MUSIC);
    if (guild.queue[0] !== guild.history[0]) guild.queue.unshift(guild.history[0]);
    guild.audioDispatcher.end();
  }

  async skipFunction(msg) {
    this.logger.info(`[COMMAND] TYPE:SKIP AUTHOR_ID:${msg.author.id} SERVERID:${msg.guild.id}`);
    const guild = await this.getGuild(msg.guild.id);
    if (!guild.audioDispatcher) return this.note(msg, 'There isn\'t anything playing to skip!', MusicClient.noteType.ERROR);
    await this.note(msg, 'Skipping song.', MusicClient.noteType.MUSIC);
    guild.audioDispatcher.end();
  }

  async volumeFunction(msg, volume) {
    if (isNaN(volume)) return this.note(msg, 'No volume specified.', MusicClient.noteType.ERROR);
    if (volume < 0 || volume > 200) {
      return this.note(msg, 'Volume should be between 0 and 200.', MusicClient.noteType.ERROR);
    }
    const guild = await this.getGuild(msg.guild.id);
    await this.note(msg, `Setting volume to ${volume}.`, MusicClient.noteType.MUSIC);
    guild.defVolume = volume;
    const guildData = await this.client.findGuild({ id: msg.guild.id }, false);
    guildData.plugins.music ? guildData.plugins.music.volume = volume : guildData.plugins.music = { volume };
    guildData.markModified('plugins.music.volume');
    await guildData.save();
    if (guild.audioDispatcher) guild.audioDispatcher.setVolume(volume / 100);
  }

  async showHistoryFunction(msg) {
    const guild = await this.getGuild(msg.guild.id);
    const pages = this.pageBuilder('Queue history', guild.history, 10);
    await paginationEmbed(msg, pages);
  }

  async showQueueFunction(msg) {
    const guild = await this.getGuild(msg.guild.id);
    const nowPlaying = this.getCurrentSong(guild);
    let nowPlayingText = 'Nothing playing right now.';
    if (nowPlaying && guild.audioDispatcher) {
      nowPlayingText = `[${nowPlaying.title}](${nowPlaying.url})\n*Requested by: <@${nowPlaying.requester}>*\n`;
    }
    const pages = this.pageBuilder('Queue', guild.queue, 5, true, 'Now Playing', nowPlayingText);
    await paginationEmbed(msg, pages);
  }

  showSearchFiltersFunction(msg) {
    this.note(
      msg,
      `Current search filters are \`${this.searchFilters.join(', ')}\`.\nSearch filters are \`${
        this.searchFiltersEnabled ? 'enabled' : 'disabled'
      }\`.`,
      MusicClient.noteType.INFO,
    );
  }

  setSearchFiltersFunction(msg, filters) {
    this.logger.info(`[COMMAND] TYPE:SETFILTERS AUTHOR_ID:${msg.author.id} SERVERID:${msg.guild.id}`);
    this.searchFilters = filters;
    this.showSearchFiltersFunction(msg);
  }

  searchFiltersModeFunction(msg, mode) {
    this.logger.info(`[COMMAND] TYPE:FILTERSMODE MODE:${mode} AUTHOR_ID:${msg.author.id} SERVERID:${msg.guild.id}`);
    switch (mode.trim().toLowerCase()) {
      case 'on':
        this.searchFiltersEnabled = true;
        return this.note(msg, 'Search filter: Enabled', MusicClient.noteType.INFO);
      case 'off':
        this.searchFiltersEnabled = false;
        return this.note(msg, 'Repeat: Disabled', MusicClient.noteType.INFO);
      default:
        return this.note(msg, 'Invalid argument.', MusicClient.noteType.ERROR);
    }
  }
};
