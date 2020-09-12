const axios = require('axios');
const Command = require('../../structures/commands');

module.exports = class PickupCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'pickup',
      aliases: [

      ],
      group: 'fun',
      memberName: 'pickup',
      fullName: 'Pickup Command',
      description: 'Gets a random pick up line, love a bit of cheese.',
      details: '',
      examples: [

      ],
      args: [

      ],
      guildOnly: true,
    });
  }

  async run(msg, args, fromPattern, result) {
    try {
      axios.get('https://mixedapi.herokuapp.com/pickup')
        .then((res) => {
          const embed = this.client.embeds.create('general')
            .setDescription(res.data.pickup.pickup)
            .setAuthor(`Pickup line for ${msg.member.displayName}`, msg.author.displayAvatarURL({ size: 256 }));
          msg.say(embed).catch((err) => this.onError(err, msg));
        })
        .catch((err) => this.onError(err, msg));
    } catch (err) {
      console.error(err);
      await this.onError(err, msg);
    }
  }
};
