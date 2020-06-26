const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');
const { http } = require('../../functions/API');
const { API } = require('../../config.json');

module.exports = class NASAAPI extends Command {
  constructor(client) {
    super(client, {
      name: 'nasa-pic',
      aliases: ['picoftheday', 'apod', 'nasapic'],
      group: 'lookups',
      memberName: 'nasa-pic',
      description: 'Gets NASA\'s pic of the day',
    });
  }

  async run(msg, args, fromPattern, something) {
    const req = await http(`https://api.nasa.gov/planetary/apod?api_key=${API.nasa}`);
    const embed = new MessageEmbed();
    embed
      .setTitle(`${req.title} - NASA photo of the day - ${req.date}`)
      .setDescription(`Description - ${req.explanation}`)
      .setColor(this.client.setting.colour)
      .setFooter(this.client.setting.footer)
      .setAuthor(`Copyright - ${req.copyright ? req.copyright : 'No copyright'}`)
      .setImage(req.hdurl);

    return msg.say(embed).catch(console.error);
  }
};
