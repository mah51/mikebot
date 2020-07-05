const Command = require('../../structures/commands');

module.exports = class ShopCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'shop',
      aliases: [

      ],
      group: 'fun',
      memberName: 'shop',
      fullName: 'Bot Shop',
      description: 'A shop where you can spend your currency!',
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
      const embed = this.client.embeds.create('general')
        .setDescription('`🛒` The shop is currently `under development`, please come back later!');
      return msg.reply(embed);
    } catch (err) {
      console.error(err);
      await this.onError(err, msg);
    }
  }
};
