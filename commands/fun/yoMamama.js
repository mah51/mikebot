const yoMamma = require('yo-mamma').default;
const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');

module.exports = class uMumma extends Command {
  constructor(client) {
    super(client, {
      name: 'yo-momma',
      aliases: [
        'ym',
        'yo-mumma',
        'yo',
      ],
      group: 'fun',
      memberName: 'yo-momma',
      description: 'Returns a yo momma insult.',
      details: '',
      examples: [

      ],
      args: [
        {
          key: 'user',
          label: 'user',
          prompt: 'Which member would you like to insult?',
          type: 'member',
        },

      ],
      guildOnly: true,
    });
  }

  async run(msg, { user }, fromPattern, something) {
    let member = user;
    if (user.id === msg.client.user.id) { member = msg.member; }
    const embed = new MessageEmbed()
      .setFooter(`From ${msg.member.displayName}`)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setTitle(`${member.user.username}:`)
      .setDescription(yoMamma());
    return msg.channel.send(embed).catch(console.error);
  }
};
