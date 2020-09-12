const Command = require('../../structures/commands');

module.exports = class BonusCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'bonus',
      aliases: [

      ],
      group: 'currency',
      memberName: 'bonus',
      fullName: 'Bonus Currency',
      description: 'Retrieve bonus currency for voting.',
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
      const userData = await this.client.findUser({ id: msg.author.id });
      const memberData = await this.client.findMember({ id: msg.author.id, guildID: msg.guild.id });

      if (userData.votes.votes.length) {
        const array = userData.votes.votes;
        const filteredArray = array.filter((vote) => !vote.claimed);

        if (filteredArray.length === 0) {
          const embed = this.client.embeds.create('error')
            .setDescription('You have claimed all your votes :(, vote at [top.gg](https://top.gg/bot/698459684205494353/)');

          return await msg.say(embed).catch(console.error);
        }

        array[array.indexOf(filteredArray[0])].claimed = true;
        memberData.balance += 300;
        userData.votes.votes = array;

        await userData.save();
        await memberData.save();

        const embed = this.client.embeds.create('general')
          .setDescription('300 Balance successfully claimed!')
          .setAuthor(msg.author.username, msg.author.displayAvatarURL())
          .addField('Unclaimed votes:', `You have ${filteredArray.length - 1} unclaimed votes.`);

        await msg.say(embed).catch(console.error);
      } else {
        const embed = this.client.embeds.create('error')
          .setDescription('You haven\'t voted yet, vote at [top.gg](https://top.gg/bot/698459684205494353/)');
        return await msg.say(embed).catch(console.error);
      }
    } catch (err) {
      console.error(err);
      await this.onError(err, msg);
    }
  }
};
