const ms = require('ms');
const Command = require('../../structures/commands');

module.exports = class StopTimer extends Command {
  constructor(client) {
    super(client, {
      name: 'stop-timer',
      aliases: [

      ],
      group: 'server-tools',
      memberName: 'stop-timer',
      description: 'Stops any running timers.',
      details: '',
      examples: [

      ],
      args: [

      ],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 20,
      },
    });
  }

  async run(msg, args, fromPattern, something) {
    let timers = msg.client.timers.get(msg.guild.id);

    if (!timers || !timers.map((timer) => timer.message.author.id).includes(msg.author.id)) { return msg.reply('You haven\'t started any timers. To start a timer use the .timer command').catch(console.error); }
    timers = timers.filter((timer) => timer.message.author.id === msg.author.id);
    if (timers.length > 1) {
      msg.reply(`You have ${timers.length} timers! Which one would you like to stop?
${timers.map((timer, index) => `${index + 1}. Has ${ms(timer.timer._idleTimeout - (Date.now() - timer.started), { long: true })} left.`).join('\n')}
            `).then(async (message) => {
        const collected = await message.channel.awaitMessages((m) => m.author.id === msg.author.id, { max: 1, time: 30000, errors: ['time'] });
        if (['1', '2', '3'].includes(collected.first().content)) {
          timers.splice(collected.first().content - 1, 1);
        }
        return msg.reply('Timer was removed! ⌚').catch(console.error);
      }).catch(console.error);
    } else {
      await msg.client.timers.delete(msg.guild.id);
      return msg.reply('Timer was removed! ⌚').catch(console.error);
    }
  }
};
