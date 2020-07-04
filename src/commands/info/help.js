const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      aliases: ['commands', 'command-list'],
      group: 'info',
      memberName: 'help',
      description: 'Displays a list of available commands, or detailed information for a specific command.',
      guarded: true,
      examples: [
        'help bot-info',
      ],
      args: [
        {
          key: 'command',
          prompt: 'Which command or module would you like to view the help for?',
          type: 'group|command',
          default: '',
        },
      ],
      guildOnly: true,
    });
  }

  async run(msg, args, fromPattern, something) {
    const { command } = args;
    // Comand
    if (command.group) {
      const embed = new MessageEmbed()
        .setTitle(`Command - \`${msg.guild.commandPrefix}${command.name}\``)
        .setTimestamp()
        .setColor(this.client.setting.colour)
        .setDescription(`${command.description}`)
        .setFooter(this.client.setting.footer)
        .addFields([
          { name: 'Detailed description: ', value: command.details ? command.details : 'No details provided' },
          { name: 'Aliases: ', value: `\`${command.aliases.join('`, `') || 'None'}\`` },
          { name: 'Usage: ', value: `${msg.anyUsage(`${command.name} ${command.format || ''}`)}` },
          { name: 'Examples: ', value: `\`${command.examples && command.examples.length > 0 ? command.examples.map((example) => msg.guild.commandPrefix + example).join('`\n`') : 'None'}\`` },
          { name: 'Module: ', value: `${command.group.name}` },
          { name: 'NSFW: ', value: `${command.nsfw ? 'Yes' : 'No'}` },
        ]);
      if (msg.channel.type === 'text') {
        msg.guild.commandPrefix !== '.' ? embed.addField('Prefix', `My custom prefix for this server is **${msg.guild.commandPrefix}** so use this as a precursor to the examples!`, false) : '';
      }
      return msg.say({ embed });
    }
    if (!command) {
      const embed = new MessageEmbed()
        .setFooter('If you want all commands use .help-all')
        .setColor(this.client.setting.colour)
        .setTimestamp()
        .setTitle('MikeBot Modules')
        .setDescription('For information on commands in a module do .help [module name]');
      this.client.registry.groups.filter((group) => {
        const array = group.commands.map((cmd) => {
          if (this.client.isOwner(msg.author)) return true;
          if (cmd.hidden || cmd.ownerOnly || !cmd.isEnabledIn(msg.guild)) return false;
          return true;
        });
        if (array.includes(true)) return true;
        return false;
      }).forEach((group) => {
        embed.addField(`\`${group.name}\``, group.description, true);
      });
      embed.addField('`Useful links 🔗`', '[Website](https://mikebot.xyz) - [Docs](https://docs.mikebot.xyz) - [Server](https://discord.gg/UmXUUaA)', true);
      return msg.say({ embed }).catch(console.error);
    }
    // group
    if (command.id) {
      const commandios = command.commands.filter((cmd) => {
        if (this.client.isOwner(msg.author)) return true;
        return !(cmd.ownerOnly || cmd.hidden);
      });
      const embed = new MessageEmbed()
        .setFooter(`There are ${commandios.size} commands in the ${command.name} module`)
        .setColor(this.client.setting.colour)
        .setTimestamp()
        .setTitle(`Commands in \`${command.name}\` module`)
        .setDescription('To get more information on a command do `.help [cmd name]`');
      commandios.forEach((cmd) => embed.addField(`\`↪\` ${cmd.fullName || cmd.name}`, `**Usage:** ${msg.guild.commandPrefix}\`${cmd.name}\`\n**Aliases:** ${cmd.aliases && cmd.aliases.length > 0 ? `\`${msg.guild.commandPrefix}${cmd.aliases.join(`\`, \`${msg.guild.commandPrefix}`)}\`` : '`No aliases`'}\n**Description:** ${cmd.description}`, false));
      return msg.say({ embed }).catch(console.error);
    }
    return msg.reply('Command or group was not found!').catch(console.error);
  }
};
