const { MessageEmbed } = require('discord.js');
const ms = require('ms');
const moment = require('moment');
const Command = require('../../structures/commands');

module.exports = class mute extends Command {
  constructor(client) {
    super(client, {
      name: 'mute',
      aliases: [

      ],
      userPermissions: ['MANAGE_MESSAGES'],
      clientPermissions: ['MANAGE_MESSAGES'],
      group: 'moderation',
      memberName: 'mute',
      description: 'Mute a member, so they can\'t join voice channels or send messages.',
      details: '',
      examples: [
        'mute @Mikerophone 1d Coughed on someone.',
      ],
      args: [
        {
          key: 'member',
          label: 'member',
          prompt: 'Which member would you like to mute?',
          type: 'member',
        },
        {
          key: 'time',
          label: 'time',
          prompt: 'How long would you like to mute this member for?',
          type: 'string',
        },
        {
          key: 'reason',
          label: 'reason',
          prompt: 'If you want to supply a reason',
          type: 'string',
          default: 'No reason provided',
        },
      ],
      guildOnly: true,
    });
  }

  async run(msg, { member, time, reason }, fromPattern, result) {
    const data = await this.getData(msg);
    if (member.id === msg.author.id) { return msg.reply('You can\'t mute yourself').catch(console.error); }
    if (isNaN(ms(time))) { return msg.reply('That time was not valid.').catch(console.error); }
    const serverTime = moment.duration(moment().diff(moment(member.joinedAt))).humanize(false);
    msg.guild.channels.cache.forEach((channel) => {
      channel.updateOverwrite(member.id, {
        SEND_MESSAGES: false,
        ADD_REACTIONS: false,
        CONNECT: false,
      }).catch(console.error);
    });

    const logChannel = msg.guild.channels.cache.get(data.guild.logs);

    const memberEmbed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setTitle(`You were muted in ${msg.guild.name}  😬`)
      .setDescription(`Reason: ${reason}`)
      .addField('Time in server', serverTime, true)
      .addField('Muted by', msg.author.username, true)
      .addField('Mute duration', ms(ms(time), { long: true }));
    const replyEmbed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setTitle(`🔇 ${member.displayName} was MUTED`)
      .setDescription(`Reason: ${reason}`)
      .addField('Time in server', serverTime, true)
      .addField('Muted by', msg.author.username, true)
      .addField('Mute duration', ms(ms(time), { long: true }));

    // eslint-disable-next-line no-unused-expressions
    !logChannel ? replyEmbed.addField('⚠ Not logged ⚠', 'Use the command **.config-log** and ensure I can send messages in it!') : '';

    const logEmbed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setAuthor('Moderation ⚔️ - 🔇 MUTE 🔇')
      .setDescription(`${member.user.username}#${member.user.discriminator} (id: ${msg.author.id}) was muted.`)
      .addField('Reason provided', reason, true)
      .addField('\u200b', '\u200b', true)
      .addField('Muted by', `${msg.author.username}#${msg.author.discriminator}`, true)
      .addField('Time in server', serverTime, true)
      .addField('Mute duration', ms(ms(time), { long: true }), true);

    msg.say(replyEmbed).catch(console.error);

    data.guild.caseNumber += 1;

    const caseInfo = {
      channel: msg.channel.id,
      moderator: msg.author.id,
      date: Date.now(),
      type: 'mute',
      case: data.guild.caseNumber,
      reason,
      time: ms(time),
    };
    const memberData = await this.client.findMember({ id: member.id, guildID: msg.guild.id });
    memberData.mute.muted = true;
    memberData.mute.endDate = Date.now() + ms(time);
    memberData.mute.case = data.guild.casesCount;
    memberData.moderation.push(caseInfo);
    memberData.markModified('moderation').catch((err) => console.log(`Error in mute command.js on mark modified: ${err}`));
    memberData.markModified('mute').catch((err) => console.log(`Error in mute command.js on mark modified: ${err}`));
    await data.guild.save();
    await memberData.save();
    member.createDM().then((channel) => {
      channel.send(memberEmbed).catch(console.error);
    }).catch(console.error);

    if (logChannel) {
      logChannel.send(logEmbed).catch(console.error);
    }
  }
};
