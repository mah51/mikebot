const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');

module.exports = class helpAll extends Command {
  constructor(client) {
    super(client, {
      name: 'help-all',
      aliases: [

      ],
      group: 'info',
      memberName: 'help-all',
      description: 'Get a list of all commands the bot provides!',
      details: '',
      guildOnly: false,
    });
  }

  async run(msg, args, fromPattern, something) {
    const embed = new MessageEmbed()
      .setTitle(`Command List - ${msg.guild ? msg.guild.name : msg.author.username}`)
      .setColor(this.client.setting.colour);
    let cmdCount = 0;
    function commandStuff(group, client) {
      const owner = client.isOwner(msg.author);
      const commands = group.commands.filter((cmd) => {
        if (owner) return true;
        if (cmd.ownerOnly || cmd.hidden) return false;
        return true;
      });
      if (!commands.size) return;
      cmdCount += commands.size;
      embed.addField(
        `⇾ ${group.name.split(/ +/).slice(0, -1).join(' ')} \`${group.name.split(/ +/).splice(-1)}\``, `\`\`\`${
          commands.map((cmd) => {
            if (msg.guild ? cmd.isEnabledIn(msg.guild.id) : true) {
              return `${cmd.name}`;
            }
            return null;
          }).filter((cmd) => cmd !== null).join(', ')}\`\`\``,
        false,
      );
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const group of this.client.registry.groups.values()) {
      if (msg.guild) {
        if (group.isEnabledIn(msg.guild)) {
          commandStuff(group, this.client);
        }
      } else {
        commandStuff(group, this.client);
      }
    }
    if (cmdCount === this.client.registry.commands.size) {
      embed.setFooter(`${this.client.registry.commands.size} Commands provided by MikeBot`);
    } else {
      embed.setFooter(`${cmdCount} Commands provided by MikeBot`);
    }
    try {
      const msgs = [];
      msgs.push(await msg.say({ embed }));
      return msgs;
    } catch (error) {
      return msg.reply('Failed to send command list 😢.');
    }
  }
};
