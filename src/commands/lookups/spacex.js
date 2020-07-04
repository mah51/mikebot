const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const axios = require('axios');
const Command = require('../../structures/commands');

module.exports = class SpaceX extends Command {
  constructor(client) {
    super(client, {
      name: 'space-x',
      aliases: [
        'spacex',
      ],
      group: 'lookups',
      memberName: 'spacex',
      description: 'Gets information about from the SpaceX\'s service',
      details: '',
      examples: [
        'space-x last',
        'space-x next',
      ],
      args: [
        {
          key: 'type',
          label: 'type',
          prompt: 'Would you like to see information on the previous launch or the next launch?',
          type: 'string',
          validate: (query) => ['latest', 'next'].includes(query.toLowerCase()),
          error: 'What launch would you like to get information on? Respond with `Latest` or `Next`.',
        },

      ],
      guildOnly: false,
    });
  }

  async run(msg, { type }, fromPattern, something) {
    const data = await axios.get(`https://api.spacexdata.com/v3/launches/${type.toLowerCase()}`);
    const req = data.data;
    const missionName = req.mission_name || 'No name provided';
    const description = req.details || false;
    const date = req.launch_date_unix || false;
    const rocket = {
      name: req.rocket.rocket_name,
      reused: req.rocket.first_stage.cores[0].reused || null,
      vehicle: req.rocket.first_stage.cores[0].landing_vehicle || false,
      payload: {
        name: req.rocket.second_stage.payloads[0].payload_id,
        customer: req.rocket.second_stage.payloads[0].customers[0],
        weight: req.rocket.second_stage.payloads[0].payload_mass_kg,
        orbit: req.rocket.second_stage.payloads[0].orbit,
      },
    };
    const image = req.links.flickr_images[0];

    const embed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setImage(image)
      .setTitle(`Information for ${missionName}`);
    date ? embed.setDescription(`Launch date: ${moment.unix(date).format('LLLL')}`) : '';
    rocket.name ? embed.addField(`Rocket: ${rocket.name}`, `${rocket.vehicle ? `**Landing vehicle: **${rocket.vehicle}` : ''}\n${rocket.reused !== null ? `**Reused core: ** ${rocket.reused}` : ''}`) : '';
    rocket.payload.name ? embed.addField(`Payload: ${rocket.payload.customer}`, `${rocket.payload.customer ? `**Customer:** ${rocket.payload.customer}` : ''}\n${rocket.payload.weight ? `**Weight:** ${rocket.payload.weight} kg` : ''}\n${rocket.payload.orbit ? `**Orbit:** ${rocket.payload.orbit}` : ''}`) : '';
    const detailsEmbed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setTitle('Additional details')
      .setDescription(description);
    return msg.say(embed).then(() => {
      if (description) { return msg.say(detailsEmbed); }
    }).catch(console.error);
  }
};
