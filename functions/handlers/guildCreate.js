const { MessageEmbed } = require('discord.js');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(guild) {
    let defaultChannel = '';
    guild.channels.cache.forEach((channel) => {
      if (channel.type === 'text' && defaultChannel === '') {
        if (channel.permissionsFor(guild.me).has('SEND_MESSAGES')) {
          defaultChannel = channel;
        }
      }
    });

    const embed = new MessageEmbed()
      .setTitle(':heart: Commands :heart:')
      .setColor(guild.client.setting.colour)
      .setDescription('The prefix for all my commands is **.**, this can be changed with .prefix');
    // eslint-disable-next-line no-restricted-syntax
    for (const group of guild.client.registry.groups.values()) {
      const commands = group.commands.filter((cmd) => {
        if (cmd.ownerOnly || cmd.hidden) return false;
        return true;
      });
      if (commands.size) {
        embed.addField(
          `⇾ ${group.name}`,
          commands.map((cmd) => `\`${cmd.name}\``).filter((cmd) => cmd !== null).join(', '),
        );
      }
    }
    guild.owner.send("Thank's so much for inviting me to your server! \nI hope I don't disappoint, and if I do make sure to leave an .idea on how to improve me 😉.", {
      embed: {
        color: guild.client.setting.colour,
        title: 'Getting started with MikeBot',
        fields: [
          {
            name: 'My default prefix:',
            value: 'My default prefixes are `.` and `@MikeBot#1680`',
          },
          {
            name: 'Use .help to see all my commands!',
            value:
          'If you are in DMs you can use `help` without the prefix.',
          },
          {
            name: 'Suggestions and bug reporting!',
            value: 'Use `.idea` to log a suggestion to the support server or `.bug` to alert the owner of a bug! Thanks ❤.',
          },
          {
            name: 'Coming Soon!',
            value:
          'Soon to come are an official website, more meme templates, and any suggestions you have!',
          },
          {
            name: 'Help and support',
            value:
          "Have a bug to report? Join [MikBot's Support Server](https://discord.gg/UmXUUaA), to get a backdoor viewing into MikeBot's development \n Or you visit the [Website](https://mikebot.xyz)",
          },
        ],
        footer: {
          text: 'Made by Mikerophone :).',
        },
        setTimestamp() {},
      },
    }).catch(console.error);

    defaultChannel.send(`Hello, my name is MikeBot! Here is a list of all my commands, if you need more information about each command do ${guild.client.commandPrefix}help <command name> or visit the [website](https://mikebot.xyz)😉
If you find any bugs or think of a sicc idea use .idea or .bug to send them to the support server! 🎉
If you like the bot, feel free to vote here: https://top.gg/bot/698459684205494353, it would be greatly appreciated! `, { embed }).catch(console.error);
  }
};
