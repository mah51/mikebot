const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');

module.exports = class Active extends Command {
  constructor(client) {
    super(client, {
      name: 'active',
      aliases: [

      ],
      group: 'owner-only',
      memberName: 'active',
      description: '',
      details: '',
      examples: [

      ],
      args: [

      ],
      guildOnly: true,
      ownerOnly: true,
      hidden: true,
    });
  }

  async run(msg, args, fromPattern, something) {
    const timersActive = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setTitle('ACTIVE TIMERS');
    const queuesActive = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setTitle('ACTIVE PLAY QUEUES');
    this.client.guilds.cache.forEach((guild) => {
      const timers = this.client.timers.get(guild.id);
      let timercount = 0;
      timers ? timers.forEach(() => { timercount += 1; }) : '';
      if (timercount > 0) {
        timersActive.addField(msg.guild.name, timercount, true);
      }
      const queue = this.client.music.guilds.get(guild.id);
      if (queue && queue.audioDispatcher) {
        queuesActive.addField(guild.name, queue.history[0].title, true);
      }
    });
    msg.reply(timersActive).catch(console.error);
    return msg.reply(queuesActive).catch(console.error);
  }
};
