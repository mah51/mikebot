const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');

module.exports = class bugReport extends Command {
  constructor(client) {
    super(client, {
      name: 'bug',
      aliases: ['bug-report'],
      group: 'util',
      guildOnly: true,
      memberName: 'bug-report',
      description: 'Report a bug to the bot owner. Don\'t use this command for suggestions there is a seperate command (.idea) for that',
      args: [
        {
          key: 'bugtext',
          label: 'bugtext',
          prompt: 'You need to supply some text to report a bug!',
          type: 'string',
          error: 'The text you supplied was not valid.',
        },
      ],
    });
  }

  async run(msg, { bugtext }, fromPattern, something) {
    const stuff = bugtext.split(/ +/);
    const guild = this.client.guilds.cache.find((guildA) => guildA.id === '714229000129609781');
    const adminChannel = guild.channels.cache.find((channel) => channel.id === '714608508430974996');
    const messageContent = stuff.join(' ');
    const reply = new MessageEmbed()
      .setColor(this.client.setting.colour)
      .setFooter(this.client.setting.footer)
      .setTimestamp()
      .setTitle(`Thank you so much ${msg.member.displayName}!`)
      .setDescription('The bug report has been logged and the owner will look into it ASAP.');
    msg.say(reply).catch(console.error);
    const embed = new MessageEmbed()
      .setTimestamp()
      .setDescription(messageContent)
      .setColor(this.client.setting.colour)
      .setFooter(this.client.setting.footer)
      .setTitle(`New bug report from ${msg.member.displayName}`)
      .addField('Bug report sent by', `${msg.author.username}#${msg.author.discriminator} - ${msg.author.id}`, true)
      .addField('\u200b', '\u200b', true)
      .addField('From the guild', `${msg.guild.name} - ${msg.guild.id}`)
      .setThumbnail(msg.author.avatarURL({ size: 128 }));

    return adminChannel.send(embed).catch(console.error);
  }
};
