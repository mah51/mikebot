const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');
const checkMessage = require('../../functions/messageFunctions/checkMessage');

module.exports = class globalMessage extends Command {
  constructor(client) {
    super(client, {
      name: 'global',
      group: 'owner-only',
      memberName: 'global',
      description: 'Send\'s a message to every server that the bot is present in.',
      details: '',
      examples: [
        '.global This is a test',
      ],
      args: [
        {
          key: 'text',
          label: 'text',
          prompt: 'What would you like to send?',
          type: 'string',
        },
      ],
      hidden: true,
      ownerOnly: true,
    });
  }

  async run(msg, { text }, fromPattern, something) {
    if (!await checkMessage(text, msg, 'ALL SERVERS')) { return msg.reply('Message was not approved in the allotted time, please try again.').catch(console.error); }
    let guildCount = 0;
    let memberCount = 0;
    const guilds = [];
    msg.client.guilds.cache.forEach((guild) => {
      let defaultChannel = '';
      guild.channels.cache.forEach((channel) => {
        if (channel.type === 'text' && defaultChannel === '') {
          if (channel.permissionsFor(guild.me).has('SEND_MESSAGES')) {
            defaultChannel = channel;
          }
        }
      });
      if (defaultChannel === '') { return msg.reply(`${guild.name} did not have any accessible channels :(.`).catch(console.error); }
      guilds.push(guild.name);
      guildCount += 1;
      memberCount += guild.memberCount;
      defaultChannel.send(text).catch(console.error);
    });
    // Sending final embed showing user the message stats.
    const embed = new MessageEmbed()
      .setTitle(`Broadcast sent to - ${guildCount} servers.`)
      .setColor(msg.client.setting.colour)
      .setDescription(`Sent to ${memberCount} members.`)
      .addField('Guilds sent to:', guilds.join(', '), false)
      .addField('Message', text, false);
    msg.reply(embed).catch(console.error);
  }
};
