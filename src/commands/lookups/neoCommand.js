const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const axios = require('axios');
const Command = require('../../structures/commands');

module.exports = class NeoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'neo',
      aliases: ['asteroids', 'neos'],
      group: 'lookups',
      memberName: 'neo',
      description: 'Gets a list of near earth objects (NEO).',
    });
  }

  async run(msg, args, fromPattern, something) {
    const today = moment(Date.now()).format('YYYY-MM-DD');
    const data = await axios.get(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${process.env.NASA_KEY}`);
    const req = data.data;
    const ordered = req.near_earth_objects[today].sort((a, b) => {
      const c = a.estimated_diameter.meters.estimated_diameter_max;
      const d = b.estimated_diameter.meters.estimated_diameter_max;
      if (c < d) { return -1; }
      if (c > d) { return 1; }
      return 0;
    });
    const smallest = Math.round(ordered[0].estimated_diameter.meters.estimated_diameter_max * 100) / 100;
    const biggest = Math.round(ordered[ordered.length - 1].estimated_diameter.meters.estimated_diameter_max * 100) / 100;
    const embed = new MessageEmbed()
      .setTitle(`There are ${req.element_count} near earth objects orbiting Earth currently`)
      .setDescription('Estimated diameter of the smallest and biggest asteroids:')
      .setColor(this.client.setting.colour)
      .setFooter(this.client.setting.footer)
      .addField('Smallest', `${smallest} meters`, true)
      .addField('Biggest', `${biggest} meters`, true);

    return msg.say(embed).catch(console.error);
  }
};
