const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');

module.exports = class knownBugCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'known-bug',
      aliases: [

      ],
      group: 'owner-only',
      memberName: 'known-bug',
      description: 'Notifies support server of user submitted bug',
      details: '',
      examples: [

      ],
      args: [
        {
          key: 'messageid',
          label: 'messageid',
          prompt: 'What is the id of the bug message?',
          type: 'string',
        },
      ],
      guildOnly: false,
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
        const channelxd = msg.guild.channels.cache.get('714639549480960021');
        const time = moment(msg.createdAt).format('LLLL');
        const embed = new MessageEmbed()
          .setTitle('Known bug!')
          .setDescription(`Bug: ${idea}`)
          .setFooter(msg.client.setting.footer)
          .setColor('#FF5251')
          .setTimestamp()
          .addField('Reported by: ', user, true)
          .addField('\u200b', '\u200b', true)
          .addField('Reported on: ', time, true);
        channelxd.send(embed).catch(console.error);
      }).catch(console.error);
  }
};
