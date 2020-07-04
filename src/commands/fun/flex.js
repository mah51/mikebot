const Command = require('../../structures/commands');

const compliments = [
  '😎 {{member}} is the coolest man in this server 😎',
  '🥵 {{member}} is the sexiest member in the server 🥵',
  '🔥 {{member}} is the best member in this server at sex (don\'t ask how I know) 🔥',
  '🤠 Ye haw, {{member}} is the coolest cowboy in this server 🤠',
  '👀 {{member}}, do be looking kinda cute 👀',
  '🙏 Everyone bow down to {{member}}, they are above all you peasants! 🙏',
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

      ],
      throttling: {
        usages: 1,
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
        .setAuthor(msg.member.displayName, msg.author.displayAvatarURL({ size: 256 }))
        .setDescription(`**${compliments[Math.floor(Math.random() * compliments.length)].replace('{{member}}', msg.member)}**`)
        .setFooter('And yes that is the supreme red on the side.');

      return msg.say(embed);
    } catch (err) {
      console.error(err);
      await this.onError(err, msg);
    }
  }
};
