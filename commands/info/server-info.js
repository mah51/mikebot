const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const Command = require('../../structures/commands');

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: 'server-info',
      aliases: [

      ],
      group: 'info',
      memberName: 'server-info',
      description: 'Gets information on the server',
      details: '',
      examples: [

      ],
      args: [

      ],
      guildOnly: true,
    });
  }

  async run(msg, args, fromPattern, something) {
    const { guild } = msg;

    const reply = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setTitle(`Server info for ${guild.name}`)
      .setThumbnail(guild.iconURL({ size: 128 }))
      .addFields(
        [
          { name: 'Owner', value: msg.guild.owner, inline: true },
          { name: 'Creation date', value: moment(msg.guild.createdAt).format('DD-MMM-YY / HH:mm:ss'), inline: true },
          { name: 'Member count', value: `${guild.memberCount} members`, inline: true },
          { name: 'Region', value: guild.region[0].toUpperCase() + guild.region.slice(1), inline: true },
          { name: 'Channels', value: `🔊 ${guild.channels.cache.filter((channel) => channel.type === 'voice').size}, 📝 ${guild.channels.cache.filter((channel) => channel.type === 'text').size}`, inline: true },
          { name: 'Server boosts', value: guild.premiumSubscriptionCount, inline: true },
          { name: 'Verification requisite', value: guild.verificationLevel[0] + guild.verificationLevel.slice(1).toLowerCase(), inline: true },
        ],
      );
    return msg.reply(reply).catch(console.error);
  }
};
