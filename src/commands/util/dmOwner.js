const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');

module.exports = class dmOwner extends Command {
  constructor(client) {
    super(client, {
      name: 'dm-owner',
      aliases: [

      ],
      group: 'util',
      memberName: 'dm-owner',
      description: 'Dm the owner!',
      details: '',
      examples: [
        'dm-owner I have le big problem',
      ],
      args: [
        {
          key: 'text',
          label: 'text',
          prompt: 'Message you would like to send to the owner',
          type: 'string',
        },
      ],
      throttling: {
        usages: 2,
        duration: 600,
      },

    });
  }

  async run(msg, { text }, fromPattern, something) {
    const ownerEmbed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setTitle(`You have a new message from ${msg.author.username}#${msg.author.discriminator}`)
      .addField('Message', text);
    const replyEmbed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setTitle('You sent a message to the owner!')
      .addField('Message', text);
    const sentto = [];
    msg.client.owners.forEach((owner) => {
      owner.createDM().then((channel) => {
        channel.send(ownerEmbed).catch(console.error);
      });
      sentto.push(owner.username);
    });
    return msg.reply(`Sent to: ${sentto.join(', ')}`, { embed: replyEmbed }).catch(console.error);
  }
};
