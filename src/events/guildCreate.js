const { MessageEmbed } = require('discord.js');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(unfetchedGuild) {
    let defaultChannel = '';
    const guild = await unfetchedGuild.fetch();
    guild.channels.cache.forEach((channel) => {
      if (channel.type === 'text' && defaultChannel === '') {
        if (channel.permissionsFor(guild.me).has('SEND_MESSAGES')) {
          defaultChannel = channel;
        }
      }
    });

    const embed = new MessageEmbed()
      .setTitle('🔥 Commands 🔥')
      .setColor(guild.client.setting.colour)
      .setDescription('The prefix for all my commands is **.**, this can be changed with .prefix');
    // eslint-disable-next-line no-restricted-syntax
    for (const group of guild.client.registry.groups.values()) {
      const commands = group.commands.filter((cmd) => !(cmd.ownerOnly || cmd.hidden));
      if (commands.size) {
        embed.addField(
          `⇾ ${group.name}`,
          commands.map((cmd) => `\`${cmd.name}\``).filter((cmd) => cmd !== null).join(', '),
        );
      }
    }
    const ownerMember = guild.owner ? guild.owner : await guild.members.fetch(guild.ownerID);
    ownerMember.send("Thank's so much for inviting me to your server! \nI hope I don't disappoint, and if I do make sure to leave an .idea on how to improve me 😉.", {
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
          'Soon to come are more currency commands, more meme templates, and any suggestions you have!',
          },
          {
            name: 'Help and support',
            value:
          "Have a bug to report? Join [MikBot's Support Server](https://discord.gg/UmXUUaA), to get a backdoor viewing into MikeBot's development \n\nOr you can visit the [Website](https://mikebot.xyz)",
          },
        ],
        footer: {
          text: 'Made by Mikerophone 😃.',
        },
        timestamp: Date.now(),
      },
    }).catch(console.error);

    defaultChannel ? defaultChannel.send(`Hello, my name is MikeBot! Here is a list of all my commands, if you need more information about each command do ${guild.commandPrefix}help <command name> or visit https://mikebot.xyz 😉
If you find any bugs or think of a sicc idea use .idea or .bug to send them to the support server! 🎉
If you like the bot, feel free to vote here: https://top.gg/bot/698459684205494353, it would be greatly appreciated + you get some pretty cool perks with \`.vote\`! 😍`, { embed }).catch(console.error) : console.log('joined guild but could not message server');
  }
};
