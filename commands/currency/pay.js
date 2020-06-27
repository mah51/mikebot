const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');

module.exports = class PayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'pay',
      nameLong: 'Pay Command',
      aliases: [

      ],
      group: 'currency',
      memberName: 'pay',
      description: 'Send some balance to a member',
      details: '',
      examples: [

      ],
      args: [
        {
          key: 'amount',
          label: 'amount',
          prompt: 'How much money would you like to send?',
          type: 'integer',
        },
        {
          key: 'member',
          label: 'member',
          prompt: 'Which member would you like to send the money to?',
          type: 'member',
        },

      ],
      guildOnly: true,
    });
  }

  async run(msg, args, fromPattern, something) {
    const { amount, member } = args;
    if (member.user.bot) { return this.makeError(msg, 'That\'s a bot! why are you sending them money 😳'); }
    if (isNaN(amount)) { return this.makeError(msg, `There was a problem with the amount you entered: ${amount}`); }
    const author = await this.client.findMember({ id: msg.member.id, guildID: msg.guild.id });
    const target = await this.client.findMember({ id: member.id, guildID: msg.guild.id });
    if (author.balance - amount < 1) { return this.makeError(msg, `You only have $${author.balance}`); }
    author.balance -= parseInt(amount);
    target.balance += parseInt(amount);
    await author.save();
    await target.save();

    return this.makeSuccess(msg, `Successfully sent \`${amount}\` to ${member.displayName}`);
  }
};
