const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');
const checkMessage = require('../../functions/messageFunctions/checkMessage');

module.exports = class dmUser extends Command {
  constructor(client) {
    super(client, {
      name: 'dm-user',
      group: 'owner-only',
      memberName: 'dm-user',
      description: 'Dm\'s a specified user.',
      details: '',
      args: [
        {
          key: 'userid',
          label: 'userid',
          prompt: 'Enter the id of the user that you want to dm',
          type: 'string',
        },
        {
          key: 'text',
          label: 'text',
          prompt: 'Enter the text you want to send',
          type: 'string',
        },
      ],
      hidden: true,
      ownerOnly: true,
    });
  }

  async run(msg, { userid, text }, fromPattern, something) {
    const info = await msg.client.users.fetch(userid);
    if (!info) { return msg.reply('No user with that id / name found').catch(console.error); }
    if (!await checkMessage(text, msg, '', '', info.user.username)) { return msg.reply('Message was not approved in the allotted time, please try again.').catch(console.error); }
    const reply = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setTitle(`Message was sent to ${info.user.username}`);
    const embed = new MessageEmbed()
      .setTitle(`A message from ${msg.author.username}`)
      .setColor(msg.client.setting.colour)
      .setFooter(msg.client.setting.footer)
      .setTimestamp()
      .addField('Message', text);
    info.createDM().then((channel) => {
      channel.send('You received a message from the owner of MikeBot, to reply use the dm-owner command', { embed }).catch(console.error);
    }).catch((err) => console.log(err));
    return msg.say(reply).catch(console.error);
  }
};
