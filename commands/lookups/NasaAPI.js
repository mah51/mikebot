const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const Command = require('../../structures/commands');

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
    const data = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_KEY}`);
    const req = data.data;
    const embed = new MessageEmbed()
      .setTitle(`${req.title} - NASA photo of the day - ${req.date}`)
      .setDescription(`Description - ${req.explanation}`)
      .setColor(this.client.setting.colour)
      .setFooter(this.client.setting.footer)
      .setAuthor(`Copyright - ${req.copyright ? req.copyright : 'No copyright'}`)
      .setImage(req.hdurl);

    return msg.say(embed).catch(console.error);
  }
};
