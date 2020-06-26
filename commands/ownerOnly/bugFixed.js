const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const Command = require('../../structures/commands');

module.exports = class bugFixedCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'bug-fix',
      group: 'owner-only',
      memberName: 'bug-fix',
      description: 'Will notify support server of a bug fix',
      details: '',

      args: [
        {
          key: 'messageid',
          label: 'messageid',
          prompt: 'Enter the message id of the bug report',
          type: 'string',
        },
      ],
      hidden: true,
      ownerOnly: true,
    });
  }

  async run(msg, { messageid }, fromPattern, something) {
    const guild = await msg.client.guilds.cache.get('714229000129609781').fetch();
    const channel = await guild.channels.cache.get('714608508430974996').fetch();
    return channel.messages.fetch(messageid)
      .then((message) => {
        const idea = message.embeds[0].description;
        const user = message.embeds[0].fields[0].value.split('#')[0];
        const channel = msg.guild.channels.cache.get('714639549480960021');
        const time = moment(msg.createdAt).format('LLLL');
        const embed = new MessageEmbed()
          .setTitle('Bug fix!')
          .setDescription(`Old problem: ${idea}`)
          .setFooter(msg.client.setting.footer)
          .setColor(msg.client.setting.colour)
          .setTimestamp()
          .addField('Reported by: ', user, true)
          .addField('\u200b', '\u200b', true)
          .addField('Reported on: ', time, true)
          .addField('Fixed on: ', moment(Date.now()).format('LLLL'), true);
        return channel.send(embed).catch(console.error);
      }).catch(console.error);
  }
};
