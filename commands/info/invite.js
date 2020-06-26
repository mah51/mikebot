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
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTitle('Click here to add this bot')
      .setURL('https://discord.com/oauth2/authorize?client_id=698459684205494353&permissions=1576528982&scope=bot')
      .addField('Support server', 'or [click here](https://discord.gg/UmXUUaA) to go to the support server')
      .setThumbnail(msg.client.user.avatarURL({ size: 128 }));
    return msg.reply(embed).catch(console.error);
  }
};
