const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const Command = require('../../structures/commands');

module.exports = class BanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ban',
      group: 'moderation',
      memberName: 'ban',
      description: 'Bans a user.',
      details: 'Bans a user and will log the action if #mod-log exists and the bot can send messages in it.',
      examples: [
        'ban @Mikerophone silly man',
      ],
      userPermissions: ['BAN_MEMBERS'],
      clientPermissions: ['BAN_MEMBERS'],
      args: [{
        key: 'member',
        label: 'member',
        prompt: 'Who would you like to ban? This command can only ban one person at a time.',
        type: 'member',
        error: 'I don\'t recognise that user, please send the User\'s name',
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

  async run(msg, { member, reason, msgdelete }, fromPattern, something) {
    if (member.id === msg.client.user.id) { return msg.reply('Nah mate that\'s not how this works.').catch(console.error); }
    if (member.id === msg.author.id) { return msg.reply('Ur mental mate... get someone else to ban you at least').catch(console.error); }
    const data = await this.getData(msg);
    if (member.roles.highest.calculatedPosition > msg.member.roles.highest.calculatedPosition - 1) { return msg.reply(`You can't ban **${member.displayName}**, their role is above yours!`).catch(console.error); }
    if (!member.bannable) { return msg.reply('The bot cannot ban this user, they are too powerful!').catch(console.error); }
    const serverTime = moment.duration(moment().diff(moment(member.joinedAt))).humanize(false);
    const modLog = data.guild.logs;
    let modLogPerms;
    if (modLog) {
      modLogPerms = modLog.permissionsFor(msg.guild.me).toArray().includes('SEND_MESSAGES');
    }

    data.guild.caseNumber += 1;

    const caseInfo = {
      channel: msg.channel.id,
      moderator: msg.author.id,
      date: Date.now(),
      type: 'ban',
      case: data.guild.caseNumber,
      reason,
    };

    const memberData = await this.client.findMember({ id: member.id, guildID: msg.guild.id });
    memberData.moderation.push(caseInfo);
    memberData.markModified('moderation');
    memberData.markModified('mute');
    await data.guild.save();
    await memberData.save();

    const memberEmbed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setTitle(`You were banned from ${msg.guild.name}  😬`)
      .setDescription(`Reason: ${reason}`)
      .addField('Time in server', serverTime, true)
      .addField('Banned by', msg.author.username, true);
    const replyEmbed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setTitle(`⚒ ${member.displayName} was BANNED from the server!`)
      .setDescription(`Reason: ${reason}`)
      .addField('Time in server', serverTime, true)
      .addField('Banned by', msg.author.username, true);
    const logEmbed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setAuthor('Moderation ⚔️ - ⚒ BAN ⚒')
      .setDescription(`${member.user.username}#${member.user.discriminator} (id: ${msg.author.id}) was banned.`)
      .addField('Reason provided', reason, true)
      .addField('\u200b', '\u200b', true)
      .addField('Banned by', `${msg.author.username}#${msg.author.discriminator}`, true)
      .addField('Time in server', serverTime, true);

    (!modLog || !modLogPerms) ? replyEmbed.addField('⚠ Not logged ⚠', 'Use the command **.config-log** and ensure I can send messages in it!') : '';
    member.createDM().then((channel) => {
      channel.send(memberEmbed).catch((err) => msg.reply(`Message could not be sent to banned user: ${err}`).catch(console.error))
        .then(() => {
          member.ban({
            reason: `${msg.author.tag}: ${reason}`,
            days: 7,
          })
            .then(() => {
              msg.reply(replyEmbed).catch(console.error);
              if (modLog && modLogPerms) {
                modLog.send(logEmbed).catch(console.error);
              }
            }).catch(console.error);
        }).catch(console.error);
    }).catch(console.error);

    return null;
  }
};
