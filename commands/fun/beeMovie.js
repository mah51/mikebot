const fs = require('fs');
const path = require('path');
const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');

module.exports = class beeMovie extends Command {
  constructor(client) {
    super(client, {
      name: 'bee-movie',
      aliases: [
        'bee',
      ],
      group: 'fun',
      memberName: 'bee-movie',
      description: 'Returns a random section from the bee movie script',
      details: '',
      examples: [

      ],
      args: [

      ],
      guildOnly: false,
    });
  }

  async run(msg, args, fromPattern, something) {
    let lines;
    return fs.readFile(path.join(__dirname, '../../assets/beemovie.txt'), (err, data) => {
      if (err) return console.error(err);
      lines = data.toString().split('\n\n\n');
      const random = Math.floor(Math.random() * lines.length);
      const embed = new MessageEmbed()
        .setFooter(msg.client.setting.footer)
        .setColor(msg.client.setting.colour)
        .setTimestamp()
        .setTitle(`Bee movie, line number: ${random + 1}`)
        .setDescription(lines[random]);
      return msg.say(embed).catch(console.error);
    });
  }
};
