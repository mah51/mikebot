const { MessageEmbed } = require('discord.js');
const ms = require('ms');
const Command = require('../../structures/commands');

module.exports = class TimerCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'timer',
      aliases: [

      ],
      group: 'server-tools',
      memberName: 'timer',
      description: 'Starts a timer in the channel you send the message, up to 12h. (Note. If bot crashes while this is running there will be no alert)',
      details: '',
      examples: [

      ],
      args: [
        {
          key: 'time',
          label: 'time',
          prompt: 'How long would you like the timer to be?',
          type: 'string',
        },
      ],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 180,
      },
    });
  }

  async run(msg, { time }, fromPattern, something) {
    if (ms(time) > 12 * 60 * 60 * 1000 || ms(time) < 60000) { return msg.reply('You cannot set a timer that is over 12 hours long or under 1 minute long!').catch(console.error); }
    const timers = this.client.timers.get(msg.guild.id);
    if (timers && timers.length > 2) { return msg.reply('The maximum number of timers running in a server at once is three! Please stop some other timers or wait until they go off to use this command.').catch(console.error); }
    const embed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setTitle(`Timer set for ${ms(ms(time), { long: true })} from now`)
      .setDescription('To be notified when timer goes off, react with the ✅ below this message.');
    msg.reply(embed).then((message) => {
      message.react('✅').catch(console.error);
      const timer = {
        timer: setTimeout(async () => {
          const users = message.reactions.cache.get('✅').users.cache.map((user) => user).filter((user) => user.id !== this.client.user.id);
          const DMEmbed = new MessageEmbed()
            .setFooter(this.client.setting.footer)
            .setColor(this.client.setting.colour)
            .setTimestamp()
            .setTitle('📯 Timer alert! 📯')
            .setDescription(`${msg.member.displayName}'s timer for ${ms(ms(time), { long: true })} went off in ${msg.guild.name}`);
          const alertEmbed = new MessageEmbed()
            .setFooter(this.client.setting.footer)
            .setColor(this.client.setting.colour)
            .setTimestamp()
            .setTitle('📯 Time\'s up! 📯')
            .setDescription(`${msg.member.displayName}'s timer for ${ms(ms(time), { long: true })} has gone off!`);
          // eslint-disable-next-line no-unused-expressions
          users.length > 0 ? alertEmbed.addField('DMing:', users.join(', '), false) : '';
          users.forEach((user) => {
            user.createDM()
              .then((channel) => {
                channel.send(DMEmbed).catch((err) => {
                  if (err.code === 50007) { return msg.say(`${user} could not be DM'd so notifying them here!`).catch(console.error); }
                  return null;
                });
              }).catch((err) => {
                console.log(err);
              });
          });
          let remainingTimers = this.client.timers.get(msg.guild.id);
          if (remainingTimers > 1) {
            remainingTimers = remainingTimers.splice(remainingTimers.indexOf(timer), 1);
            await this.client.timers.set(msg.guild.id, remainingTimers);
          } else {
            this.client.timers.delete(msg.guild.id);
          }
          msg.channel.send(alertEmbed).catch(console.error);
        }, ms(time)),
        message: msg,
        started: Date.now(),
      };
      if (timers) {
        timers.push(timer);
      } else {
        this.client.timers.set(msg.guild.id, [timer]);
      }
    }).catch(console.error);
    return null;
  }
};
