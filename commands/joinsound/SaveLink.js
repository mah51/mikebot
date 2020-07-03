const ytdl = require('ytdl-core');
const Command = require('../../structures/commands');
const { youtubeParser } = require('../../util/util');

module.exports = class SaveLink extends Command {
  constructor(client) {
    super(client, {
      name: 'save-link',
      aliases: ['sl', 'slink'],
      group: 'join-sound',
      memberName: 'savelink',
      description: 'Saves a link to play when user joins a voice channel.',
      guildOnly: true,
      examples: [
        'save-link https://www.youtube.com/watch?v=oHg5SJYRHA0',
      ],
      args: [{
        key: 'link',
        prompt: 'What is the link?',
        type: 'string',
      },
      ],
    });
  }

  async run(msg, { link }, fromPattern, something) {
    let song; let
      songInfo;
    try {
      songInfo = await ytdl.getInfo(link);
      song = {
        title: songInfo.title,
        url: songInfo.video_url,
        duration: songInfo.length_seconds,
      };
    } catch (error) {
      if (error.message.includes('copyright')) {
        return msg
          .reply('⛔ The video could not be saved because of copyright complications ⛔');
      }
      return msg.reply(`There was an error: ${error}`).catch(console.error);
    }
    if (song.duration > 31) return msg.reply('Due to problem out of MikeBot\'s control videos can only be 30 seconds long max.');
    const memberData = await this.client.findMember({ id: msg.member.id, guildID: msg.guild.id });
    if (!memberData) { return this.makeError('Couldn\'t find member data.'); }
    const videoID = await youtubeParser(link);
    if (!videoID) { return this.makeError('That youtube link wasn not valid!').catch(console.error); }
    memberData.joinSound.url = videoID;
    memberData.markModified('joinSound.url');
    await memberData.save();
    return msg.say(`Link saved successfully! \nThe bot will join and play ${song.title} when ${msg.author} joins a channel.${song.duration > 6 ? 'Please note the bot will only play the first 6 seconds of the video so it doesn\'t annoy users' : ''}`).catch(console.error);
  }
};
