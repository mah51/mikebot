const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');


module.exports = class clapBack extends Command {
  constructor(client) {
    super(client, {
      name: 'clap',
      aliases: [

      ],
      group: 'text',
      memberName: 'clap',
      description: 'Mikebot 👏 is 👏 the 👏 best 👏 discord 👏 bot.',
      details: '',
      examples: [

      ],
      args: [
        {
          key: 'text',
          label: 'text',
          prompt: 'What text would you like clapped?',
          type: 'string',
        },
      ],
      guildOnly: false,
    });
  }

  async run(msg, { text }, fromPattern, something) {
    const embed = new MessageEmbed()
      .setFooter(`Clapped by ${msg.member.displayName} 😉`)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setTitle(`${text.split(/\s+/).join(' 👏 ')} 👏`);
    return msg.say(embed).catch(console.error);
  }
};
