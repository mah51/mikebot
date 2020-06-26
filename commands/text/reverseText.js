const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');

module.exports = class ReverseCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'reverse',
      aliases: [],
      group: 'text',
      memberName: 'reverse',
      description: 'Reverse some text.',
      examples: ['reverse !txet emos desrever tsuj uoy ,ereht yeh'],

      args: [
        {
          key: 'text',
          prompt: 'What text would you like to reverse?',
          type: 'string',
        },
      ],
    });
  }

  async run(msg, { text }, fromPattern, something) {
    const msgString = text.split('');
    let reverseString = '';
    for (let i = msgString.length - 1; i >= 0; i -= 1) {
      reverseString += msgString[i];
    }
    const embed = new MessageEmbed()
      .setTimestamp()
      .setDescription(reverseString)
      .setColor(this.client.setting.colour)
      .setFooter(`Text reversed for ${msg.member.displayName}`);
    return msg.say(embed).catch(console.error);
  }
};
