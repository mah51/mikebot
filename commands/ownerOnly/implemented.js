const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');

module.exports = class implementedCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'implemented',
      aliases: [

      ],
      group: 'owner-only',
      memberName: 'implemented',
      description: 'Notifies support server of an implemented suggestion',
      details: '',
      examples: [

      ],
      args: [
        {
          key: 'messageid',
          label: 'messageid',
          prompt: 'The id of the suggestion message.',
          type: 'string',
        },
        {
          key: 'usage',
          label: 'usage',
          prompt: 'Usage of the new command.',
          type: 'string',
          default: '',
        },
      ],
      guildOnly: false,
      ownerOnly: true,
      hidden: true,
    });
  }

  async run(msg, { messageid, usage }, fromPattern, something) {
    const guild = await msg.client.guilds.cache.get('714229000129609781').fetch();
    const channel = await guild.channels.cache.get('714598311918567453').fetch();
    return channel.messages.fetch(messageid)
      .then((message) => {
        const idea = message.embeds[0].description;
        const user = message.embeds[0].fields[0].value.split('#')[0];
        const channel = msg.guild.channels.cache.get('714639549480960021');
        const time = moment(msg.createdAt).format('LLLL');
        const embed = new MessageEmbed()
          .setTitle('User suggestion implemented!')
          .setDescription(`Suggestion: ${idea}`)
          .setFooter(msg.client.setting.footer)
          .setColor(msg.client.setting.colour)
          .setTimestamp()
          .addField('Suggested by: ', user, true)
          .addField('\u200b', '\u200b', true)
          .addField('Suggested on: ', time, true);
        usage ? embed.addField('Command usage', usage, false) : '';
        channel.send(embed).catch(console.error);
      }).catch(console.error);
  }
};
