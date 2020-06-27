const { MessageEmbed } = require('discord.js');
const ms = require('ms');
const moment = require('moment');
const Command = require('../../structures/commands');

module.exports = class Reminder extends Command {
  constructor(client) {
    super(client, {
      name: 'reminder',
      aliases: [
        'remind-me',
      ],
      group: 'server-tools',
      memberName: 'reminder',
      description: 'Set a reminder for any date.',
      details: '',
      examples: [
        'reminder 12.05.2020 12:00 Someones bday!',
      ],
      args: [
        {
          key: 'date',
          label: 'date',
          prompt: 'What date would you like to be reminded on?',
          type: 'string',
          error: 'That date format was invalid use YYYY-MM-DD eg). 2020-06-20',
          validate: (query) => moment(query).isValid(),
        },
        {
          key: 'time',
          label: 'time',
          prompt: 'What time would you like to be reminded?',
          type: 'string',
          error: 'Please provide your time as a string in 24 hour format, relative to GMT, like so 12:00 would be midday.',
          validate: (query) => query.split(':').length === 2 && typeof parseInt(query.split(':')[0]) === 'number' && typeof parseInt(query.split(':')[1]) === 'number' && query.split(/ +/).length === 1,
        },
        {
          key: 'reminder',
          label: 'reminder',
          prompt: 'What would you like to set the reminder to?',
          type: 'string',
          error: 'The reminder has to be less than 400 characters long.',
          validate: (query) => query.length < 400,
        },
      ],
      guildOnly: true,
    });
  }

  async run(msg, args, fromPattern, something) {
    const date = moment(`${args.date}T${args.time}:00`);
    const data = await this.getData(msg);
    if (date < Date.now()) { return this.makeError(msg, 'That date has already passed!'); }
    const reminder = {
      message: args.reminder,
      channel: msg.channel.id,
      setTime: Date.now(),
      time: date.valueOf(),
    };
    data.memberData.reminders.push(reminder);
    data.memberData.markModified('reminders');
    await data.memberData.save();
    const embed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setTitle(`I set a reminder for you, ${msg.member.displayName}`)
      .setDescription(`I will alert you on ${moment(date).format('LLLL')}`)
      .addField('Message', args.reminder, false)
      .addField('Channel', msg.channel.name, true)
      .addField('Reminder set', moment(Date.now()).format('LLLL'), true);

    msg.say(embed).catch(console.error);
    return msg;
  }
};
