const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');
const { http } = require('../../functions/API');

module.exports = class nasaAstro extends Command {
  constructor(client) {
    super(client, {
      name: 'astro',
      aliases: ['astronaut', 'pis'],
      group: 'lookups',
      memberName: 'astronauts',
      description: 'Returns with astronauts currently in space and the position of the iss.',
    });
  }

  async run(msg, args, fromPattern, something) {
    const req = await http('http://api.open-notify.org/astros.json');
    const req1 = await http('http://api.open-notify.org/iss-now.json');
    const embed = new MessageEmbed();
    embed
      .setTitle(`There are currently **${req.number}** of people in space`)
      .setDescription('The location of the ISS is currently:')
      .addField('Latitude', `\`${req1.iss_position.latitude}\``, true)
      .addField('Longitude', `\`${req1.iss_position.longitude}\``, true)
      .setColor(this.client.setting.colour)
      .setFooter(this.client.setting.footer)
      .addField('Astronauts currently in space', `\`${req.people.map((person) => person.name).join('`, `')}\``);

    return msg.say(embed).catch(console.error);
  }
};
