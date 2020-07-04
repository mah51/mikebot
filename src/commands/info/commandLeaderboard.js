const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const Command = require('../../structures/commands');

module.exports = class CommandLeaderboardCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'command-leaderboard',
      group: 'info',
      memberName: 'command-leaderboard',
      description: 'Responds with a leaderboard of most commonly used commands.',
      guarded: true,
      args: [
        {
          key: 'page',
          prompt: 'What page do you want to view?',
          type: 'integer',
          default: 1,
          min: 1,
        },
      ],
    });
  }

  async run(msg, { page }, fromPattern, something) {
    function makeLeaderboard() {
      const embed = new MessageEmbed()
        .setFooter(msg.client.setting.footer)
        .setColor(msg.client.setting.colour)
        .setTimestamp()
        .setTitle('Command Usage Leaderboard:')
        .setDescription(`since server restart - ${moment(msg.client.setting.start_time).format('HH:mm:ss [-] DD/MM/YY')}`);
      msg.client.registry.commands
        .filter((command) => command.uses !== undefined && !command.unknown && !command.hidden)
        .sort((a, b) => b.uses - a.uses)
        .array()
        .slice((page - 1) * 10, page * 10)
        .forEach((command, index) => {
          const number = index + 1;
          embed.addField(`**${number}. ${command.name}** command`, `**${command.uses}** use ${command.uses !== 1 ? 's' : ''}`, false);
        });

      return embed;
    }

    return msg.say(await makeLeaderboard()).catch(console.error);
  }
};
