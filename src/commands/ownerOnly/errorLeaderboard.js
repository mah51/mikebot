const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const MikeBotCommand = require('../../structures/commands');

module.exports = class ErrorLeaderboardCommand extends MikeBotCommand {
  constructor(client) {
    super(client, {
      name: 'command-errors',
      aliases: [
        'errors',
      ],
      group: 'owner-only',
      memberName: 'command-errors',
      description: 'Responds with a leaderboard of command errors.',
      guarded: true,
      ownerOnly: true,
      hidden: true,
      args: [
        {
          key: 'command',
          prompt: 'What command do you want to view?',
          type: 'command',
          default: '',
        },
      ],
    });
  }

  async run(msg, { command }, fromPattern, something) {
    function makeLeaderboard() {
      const embed = new MessageEmbed()
        .setFooter(msg.client.setting.footer)
        .setColor(msg.client.setting.colour)
        .setTimestamp()
        .setTitle('Command Usage Leaderboard:')
        .setDescription(`since server restart - ${moment(msg.client.setting.start_time).format('HH:mm:ss [-] DD/MM/YY')}`);
      msg.client.registry.commands
        .filter((commandxd) => commandxd.errorCount !== undefined && !commandxd.unknown)
        .sort((a, b) => b.errorCount - a.errorCount)
        .array()
        .slice(0, 10)
        .forEach((commandoa, index) => {
          const number = index + 1;
          embed.addField(`**${number}. ${commandoa.name}** command`, `**${commandoa.errorCount}** error ${commandoa.errorCount !== 1 ? 's' : ''}`, false);
        });

      return embed;
    }
    if (!command) { return msg.say(await makeLeaderboard()).catch(console.error); }
    const newembed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setTitle(`${command.name} Errors`);
    command.errors.forEach((error, index) => {
      newembed.addField(`${index + 1}. ${error.author} - ${error.content}`, `${error.error}`);
    });
    return msg.reply(newembed).catch(console.error);
  }
};
