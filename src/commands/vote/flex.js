const ms = require('ms');
const Command = require('../../structures/commands');

const compliments = [
  '`😎` {{member}} is the coolest man in this server `😎`',
  '`🥵` {{member}} is the sexiest member in the server `🥵`',
  '`🔥` {{member}} is the best member in this server at the sex (don\'t ask how I know) `🔥`',
  '`🤠` Ye haw, {{member}} is the coolest cowboy in this server `🤠`',
  '`👀` {{member}}, do be the cutest on the server `👀`',
  '`🙏` Everyone bow down to {{member}}, they are above all you peasants! `🙏`',
];

module.exports = class FlexCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'flex',
      aliases: [

      ],
      group: 'vote',
      memberName: 'flex',
      fullName: 'Flex',
      description: 'If you have voted for the bot go flex on some nerds.',
      details: '',
      examples: [

      ],
      args: [
        {
          key: 'member',
          label: 'member',
          prompt: 'Would you like to flex on someone?',
          type: 'member',
          default: '',
        },
      ],
      throttling: {
        usages: 2,
        duration: 300,
      },
      guildOnly: true,
    });
  }

  async run(msg, args, fromPattern, result) {
    try {
      const userData = await this.client.findUser({ id: msg.author.id });
      if (!userData.votes.value) {
        if (await this.client.dbl.hasVoted(msg.author.id)) {
          userData.votes.value = true;
          userData.votes.votes.push({
            date: Date.now(),
            site: 'unknown',
          });
          userData.markModified('votes');
          userData.save();
        } else {
          return this.makeError(msg, 'You haven\'t voted yet! to vote go to [top.gg](https://top.gg/bot/698459684205494353) to vote for MikeBot and get some perks! ❤');
        }
      }
      const embed = this.client.embeds.create('flex')
        .setAuthor(args.member ? `${msg.member.displayName} is absolutely flexing on all you losers` : `${msg.member.displayName} is flexing on ${args.member.displayName}`, msg.author.displayAvatarURL({ size: 256 }))
        .setDescription(`**${compliments[Math.floor(Math.random() * compliments.length)].replace('{{member}}', msg.member)}**`)
        .setTitle('F L E X I N G')
        .setFooter('And yes that is the supreme red on the side = le big flex');
      if (args.member) {
        const userData_ = await this.client.findUser({ id: args.member.id });
        if (userData_ && userData_.votes.votes[userData_.votes.votes.length - 1].date > userData.votes.votes[userData.votes.votes.length - 1].date) {
          embed.setDescription(`${msg.member} well well well, how the turn tables. ${args.member} has voted more recently than you, now you must take the yo-momma joke.`);
          args.user = msg.member;
        } else {
          embed
            .setDescription(`${msg.member} wanted you to know how inferior you are, also have a yo momma joke on the house.`);
          args.user = args.member;
        }
      }
      await msg.say(embed);
      if (args.member) {
        await this.client.registry.commands.get('yo-momma').run(msg, args, fromPattern, result);
      }
      return msg;
    } catch (err) {
      console.error(err);
      await this.onError(err, msg);
    }
  }
};
