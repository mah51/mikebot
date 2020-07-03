const ytdl = require('ytdl-core');
const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');

module.exports = class SaveLink extends Command {
  constructor(client) {
    super(client, {
      name: 'join-link',
      aliases: ['jl', 'joinl', 'soundeffect'],
      group: 'join-sound',
      guildOnly: true,
      memberName: 'join-link',
      description: 'Check the current join sound you have saved!',
    });
  }

  async run(msg, args, fromPattern, result) {
    const memberInfo = await this.client.findMember({ id: msg.member.id, guildID: msg.guild.id }, true);
    if (!memberInfo.joinSound.url) return this.makeError(msg, `No link saved use ${msg.guild.commandPrefix}savelink < - YT URL - >`).catch(console.error);

    const urlInfo = await ytdl.getBasicInfo(memberInfo.joinSound.url);
    const embed = new MessageEmbed()
      .setTitle('Saved link:')
      .setDescription(urlInfo.title)
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setAuthor(`${msg.author.username}'s`, msg.author.avatarURL())
      .addFields([
        { name: 'Length', value: `${urlInfo.length_seconds} seconds`, inline: true },
        { name: 'Likes', value: `${urlInfo.likes}`, inline: true },
        { name: 'Views', value: urlInfo.player_response.videoDetails.viewCount, inline: true },
      ])
      .setThumbnail(urlInfo.player_response.videoDetails.thumbnail.thumbnails[1].url)
      .setURL(urlInfo.video_url);

    await msg.embed(embed).catch(console.error);
  }
};
