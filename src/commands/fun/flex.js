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
      group: 'fun',
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
      const userData = await this.client.findUser({ id: msg.author.id }, true);
      if (userData.votes.count === 0) { return this.makeError(msg, 'You haven\'t voted yet! to vote go to [top.gg](https://top.gg/bot/698459684205494353) to vote for MikeBot and use the `.vote` command to get some perks! ❤'); }
      if (Date.now() - userData.votes.cooldown > 43200000) { return this.makeError(msg, 'It has been longer than 12 hours since you last voted! to regain access to this command go and vote at [top.gg](https://top.gg/bot/698459684205494353)! and do `.vote` :P.'); }
      const embed = this.client.embeds.create('flex')
        .setAuthor(`${msg.member.displayName} is absolutely flexing on all you losers`, msg.author.displayAvatarURL({ size: 256 }))
        .setDescription(`**${compliments[Math.floor(Math.random() * compliments.length)].replace('{{member}}', msg.member)}**`)
        .setTitle('F L E X I N G')
        .setFooter('And yes that is the supreme red on the side = le big flex');
      if (args.member) {
        embed.setAuthor(`${msg.member.displayName} is flexing on ${args.member.displayName}`)
          .setDescription(`${msg.member} wanted you to know how inferior you are, also have a yo momma joke on the house.`);
        args.user = args.member;
        await this.client.registry.commands.get('yo-momma').run(msg, args, fromPattern, result);
      }
      return msg.say(embed);
    } catch (err) {
      console.error(err);
      await this.onError(err, msg);
    }
  }
};
