const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const Command = require('../../structures/commands');

module.exports = class KickCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kick',
      group: 'moderation',
      memberName: 'kick',
      description: 'Kicks a user.',
      details: 'Command kicks a user and logs the action if #mod-log exists and the bot can send messages in it.',
      examples: [
        'kick <user> <reason>',
        'kick @Mikerophone silly man',
      ],
      userPermissions: ['KICK_MEMBERS'],
      clientPermissions: ['KICK_MEMBERS'],
      args: [{
        key: 'member',
        label: 'member',
        prompt: 'Who would you like to kick? This command can only kick one person at a time.',
        type: 'member',
        error: 'I don\'t recognise that user',
        infinite: false,
      },
      {
        key: 'reason',
        label: 'reason',
        prompt: 'Provide a reason for the kick.',
        type: 'string',
        default: 'No reason supplied',
        validate: (reason) => {
          if (reason.length < 140) return true;
          return 'Reason must be under 140 characters!';
        },
      }],
      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 5,
      },
    });
  }

  async run(msg, { member, reason }, fromPattern, something) {
    if (member.id === this.client.user.id) return msg.channel.send('This makes me the big sad');
    if (member.id === msg.author.id) return msg.channel.send('As if i would kick you...');
    const data = await this.getData(msg);
    if (member.roles.highest.calculatedPosition > msg.member.roles.highest.calculatedPosition - 1) return msg.channel.send(`You can't kick **${member.displayName}**! Their role is higher than yours!`);
    if (!member.kickable) { return msg.say('The bot cannot kick this user, they are too powerful!').catch(console.error); }
    const serverTime = moment.duration(moment().diff(moment(member.joinedAt))).humanize(false);
    const modLog = msg.guild.channels.cache.get(data.guild.logs);
    let modLogPerms;
    if (modLog) {
      modLogPerms = modLog.permissionsFor(msg.guild.me).toArray().includes('SEND_MESSAGES');
    }

    const memberEmbed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setTitle(`You were kicked from ${msg.guild.name}  😬`)
      .setDescription(`Reason: ${reason}`)
      .addField('Time in server', serverTime, true)
      .addField('Kicked by', msg.author.username, true);
    const replyEmbed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setTitle(`${member.displayName} was **KICKED** 🦶`)
      .setDescription(`Reason: ${reason}`)
      .addField('Time in server', serverTime, true)
      .addField('Kicked by', msg.author.username, true);
    const logEmbed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setAuthor('Moderation ⚔️ - 🦶 KICK 🦶')
      .setDescription(`${member.user.username}#${member.user.discriminator} (id: ${msg.author.id}) was kicked.`)
      .addField('Time in server', serverTime, true)
      .addField('\u200b', '\u200b', true)
      .addField('Kicked by', `${msg.author.username}#${msg.author.discriminator}`, true)
      .addField('Reason provided', reason, true);
    (!modLog || !modLogPerms) ? replyEmbed.addField('⚠ Not logged ⚠', 'To log moderation events create a channel called mod-log and ensure I can send messages in it!') : '';
    msg.say(replyEmbed).catch(console.error);
    member.createDM().then((channel) => {
      channel.send(memberEmbed).then(() => {
        member.kick({ reason }).catch(console.error);
      }).catch(console.error);
      if (modLog && modLogPerms) {
        modLog.send(logEmbed).catch(console.error);
      }
    }).catch(console.error);
    return msg;
  }
};
