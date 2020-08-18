const axios = require('axios');
const Command = require('../../structures/commands');

module.exports = class InsultGenerator extends Command {
  constructor(client) {
    super(client, {
      name: 'insult',
      aliases: [

      ],
      group: 'fun',
      memberName: 'insult',
      fullName: 'Insult Command',
      description: 'Insults a user',
      details: '',
      examples: [

      ],
      args: [
        {
          key: 'member',
          label: 'member',
          prompt: 'Who would you like to insult?',
          type: 'member',
          default: (msg) => msg.member,
        },
      ],
      guildOnly: true,
    });
  }

  async run(msg, args, fromPattern, result) {
    try {
      const res = await axios.get('https://insult.mattbas.org/api/insult.json');
      const embed = this.client.embeds.create()
        .setAuthor(args.member.displayName, args.member.user.displayAvatarURL({ size: 256 }))
        .setDescription(res.data.insult);
      await msg.say(embed);
    } catch (err) {
      console.error(err);
      await this.onError(err, msg);
    }
  }
};
