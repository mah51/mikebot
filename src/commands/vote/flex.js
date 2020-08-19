const moment = require('moment');
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
      if (!await this.client.dbl.hasVoted(msg.author.id)) { return this.makeError(msg, 'You haven\'t voted in the past 12 hours! to vote go to [top.gg](https://top.gg/bot/698459684205494353) to vote for MikeBot and get some perks! ❤'); }
      const embed = this.client.embeds.create('flex');
      let targetUser = userData;
      if (args.member) {
        const oppUser = await this.client.findUser({ id: args.member.id });

        if (oppUser && oppUser.votes.count > userData.votes.count) {
          embed.setDescription(`${msg.member} well well well, how the turn tables. ${args.member} has voted ${oppUser.votes.count - userData.votes.count} times more than you, now you must take the yo-momma joke.`);
          args.user = msg.member;
          targetUser = oppUser;
        } else {
          embed
            .setDescription(`${msg.member} wanted you to know how inferior you are, also have a yo momma joke on the house.`);
          args.user = args.member;
        }
      } else {
        embed
          .setAuthor(`${msg.member.displayName} is absolutely flexing on all you losers`, msg.author.displayAvatarURL({ size: 256 }))
          .setDescription(`**${compliments[Math.floor(Math.random() * compliments.length)].replace('{{member}}', msg.member)}**`)
          .setFooter('And yes that is the supreme red on the side = le big flex');
      }
      embed
        .addField('Vote count', targetUser.votes.count, true)
        .addField('\u200b', '\u200b', true)
        .addField('Last vote', moment.duration(targetUser.votes.votes[targetUser.votes.votes.length - 1].date - Date.now()).humanize(true), true)
        .setTitle('F L E X I N G');
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
