const Command = require('../../structures/commands');

module.exports = class VoteRewardsCommands extends Command {
  constructor(client) {
    super(client, {
      name: 'vote',
      aliases: [
        'vote-rewards',
      ],
      group: 'server-tools',
      memberName: 'vote',
      fullName: 'Vote Rewards',
      description: 'Get some pretty sweet rewards if you vote for the bot!',
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
      const hasVoted = await this.client.dbl.hasVoted(msg.author.id);
      if (!hasVoted) { return this.makeError(msg, 'Hmm... it seems you haven\'t voted in the last 12 hours. Go to [Top.gg](https://top.gg/bot/698459684205494353) and vote for Me! ❤'); }
      const userInfo = await this.client.findUser({ id: msg.author.id });
      const memberInfo = await this.client.findMember({ id: msg.author.id, guildID: msg.guild.id });
      if (userInfo.votes && Date.now() - userInfo.votes.cooldown < 43200000) { return this.makeError(msg, 'It seems you have received rewards already in the last 12 hours, but thanks for voting! 🤪'); }

      memberInfo.balance += 500;

      userInfo.votes.cooldown = Date.now();
      userInfo.votes.count += 1;
      userInfo.votes.votes.push({
        date: Date.now(),
        count: userInfo.votes.count,
        site: 'top.gg',
      });
      userInfo.markModified('votes');
      await memberInfo.save();
      await userInfo.save();

      const embed = this.client.embeds.create('general')
        .setDescription('You are a legend! Thanks for voting for me, it really helps out, as a token of appreciation I gave you some perks :)')
        .addField('Balance', 'I added 500 balance to your account, you can use this for mini games or in the shop.', true)
        .addField('\u200b', '\u200b', true)
        .addField('Flex command', 'I gave you access to the `.flex` command for 12 hours, now go flex on some peasants.', true)
        .setAuthor(msg.member.displayName, msg.author.displayAvatarURL({ size: 256 }));

      return await msg.say(embed);
    } catch (err) {
      console.error(err);
      await this.onError(err, msg);
    }
  }
};
