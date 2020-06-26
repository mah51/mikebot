const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');
const checkMessage = require('../../functions/messageFunctions/checkMessage');

module.exports = class broadcastCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'broadcast',
      group: 'owner-only',
      memberName: 'broadcast',
      description: 'Broadcasts to a specific server / channel',
      details: '',
      args: [
        {
          key: 'serverid',
          label: 'Server ID',
          prompt: 'Enter the server ID of the server you would like to broadcast to',
          type: 'string',
        },
        {
          key: 'channelid',
          label: 'channelid',
          prompt: 'Enter the channel ID of the channel you would like to broadcast to - leave blank for no specified channel',
          type: 'string',
          default: '',
        },
        {
          key: 'text',
          label: 'text',
          prompt: 'Enter the text you would like to send',
          type: 'string',
        },
      ],
      hidden: true,
      ownerOnly: true,
    });
  }

  async run(msg, { serverid, channelid, text }, fromPattern, something) {
    const guild = msg.client.guilds.cache.find((guild) => guild.name === serverid || guild.id === serverid);
    if (!guild) { return msg.reply('No guild with that id / name found').catch(console.error); }
    let defaultChannel = '';
    if (channelid !== '') {
      guild.channels.cache.forEach((channel) => {
        if ((channel.name === channelid || channel.id === channelid) && channel.permissionsFor(guild.me).has('SEND_MESSAGES')) { return defaultChannel = channel; }
      });
    } else {
      guild.channels.cache.forEach((channel) => {
        if (channel.type === 'text' && defaultChannel === '') {
          if (channel.permissionsFor(guild.me).has('SEND_MESSAGES')) {
            defaultChannel = channel;
          }
        }
      });
    }
    if (defaultChannel === '') { return msg.reply("That server didn't have any accessible channels.").catch(console.error); }
    if (!await checkMessage(text, msg, guild.name, defaultChannel.name)) { return msg.reply('Message was not approved in the allotted time, please try again.').catch(console.error); }
    defaultChannel.send(text).catch(console.error);
    const embed = new MessageEmbed()
      .setTitle(`Broadcast sent to - ${guild.name}`)
      .setColor(msg.client.setting.colour)
      .setDescription(`The guild has: ${guild.memberCount} members and is owned by ${guild.owner.user.username}.`)
      .addField('Message', text, true);
    return msg.reply(embed).catch(console.error);
  }
};
