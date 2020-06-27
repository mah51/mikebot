const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');

module.exports = class SaveLink extends Command {
  constructor(client) {
    super(client, {
      name: 'invite',
      aliases: ['link', 'invitelink'],
      group: 'info',
      memberName: 'invite',
      description: 'Provides the bot\'s invitation link',
    });
  }

  async run(msg, args, fromPattern, something) {
    const embed = new MessageEmbed()
      .setFooter(`❤ ${msg.member.displayName}`, msg.author.displayAvatarURL({ size: 128 }))
      .setColor(this.client.setting.colour)
      .setTitle(`Add ${this.client.user.username} to your server`)
      .setURL('https://discord.com/oauth2/authorize?client_id=698459684205494353&permissions=1576528982&scope=bot')
      .addField('`Useful links 🔗`', '[Website](https://mikebot.xyz) - [Docs](https://docs.mikebot.xyz) - [Support server](https://discord.gg/UmXUUaA)')
      .setThumbnail(msg.client.user.avatarURL({ size: 128 }));
    return msg.reply(embed).catch(console.error);
  }
};
