const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const Command = require('../../structures/commands');

module.exports = class warnCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'warn',
      aliases: [

      ],
      group: 'moderation',
      memberName: 'warn',
      description: 'Warn a member, if they have been warned three times you will be notified',
      details: '',
      userPermissions: ['MANAGE_MESSAGES'],
      userRoles: ['Mod'],
      examples: [
        'warn @Mikerophone For spamming this channel',
      ],
      args: [
        {
          key: 'member',
          label: 'member',
          prompt: 'Which member would you like to warn?',
          type: 'member',
        },
        {
          key: 'reason',
          label: 'reason',
          prompt: 'Provide a reason for warning the user',
          type: 'string',
          default: '',
        },
      ],
      guildOnly: true,
    });
  }

  async run(msg, { member, reason }, fromPattern, something) {
    const data = await this.getData(msg);
    const logChannel = msg.guild.channels.cache.get(data.guild.logs);
    const serverTime = moment.duration(moment().diff(moment(member.joinedAt))).humanize(false);
    data.guild.caseNumber += 1;
    const caseInfo = {
      channel: msg.channel.id,
      moderator: msg.author.id,
      date: Date.now(),
      type: 'warn',
      case: data.guild.caseNumber,
      reason: reason || 'No reason provided',
    };

    const memberData = this.client.findMember({ id: member.id, guildID: msg.guild.id });
    const warnCount = memberData.moderation.filter((thing) => thing.type === 'warn').length;
    memberData.moderation.push(caseInfo);
    memberData.markModified('moderation');
    await data.guild.save();
    await memberData.save();
    const memberEmbed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setTitle(`You were warned in ${msg.guild.name}  😬`)
      .setDescription(`Reason: ${reason}`)
      .addField('Time in server', serverTime, true)
      .addField('Warned by', msg.author.username, true)
      .addField('Number of warns', warnCount, true);
    const replyEmbed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setTitle(`${member.displayName} was **WARNED** ⚠`)
      .setDescription(`Reason: ${reason}`)
      .addField('Time in server', serverTime, true)
      .addField('Warned by', msg.author.username, true)
      .addField('Number of warns', warnCount, true);
    const logEmbed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setAuthor('Moderation ⚔️ - ⚠ WARN ⚠')
      .setDescription(`${member.user.username}#${member.user.discriminator} (id: ${msg.author.id}) was kicked.`)
      .addField('Time in server', serverTime, true)
      .addField('\u200b', '\u200b', true)
      .addField('Warned by', `${msg.author.username}#${msg.author.discriminator}`, true)
      .addField('Reason provided', reason, true)
      .addField('Number of warns', warnCount, true);
    !logChannel ? replyEmbed.addField('⚠ Not logged ⚠', 'To log moderation events create a channel called mod-log and ensure I can send messages in it!') : '';

    msg.say(replyEmbed).catch(console.error);
    if (logChannel) {
      logChannel.send(logEmbed).catch(console.error);
    }
    member.createDM().then((channel) => {
      channel.send(memberEmbed).catch(console.error);
    }).catch(console.error);
    return msg;
  }
};
