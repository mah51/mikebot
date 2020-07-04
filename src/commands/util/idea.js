const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');
const wordFilter = require('../../functions/messageFunctions/messageFilter');

module.exports = class Suggestion extends Command {
  constructor(client) {
    super(client, {
      name: 'idea',
      aliases: ['suggestion'],
      group: 'util',
      memberName: 'idea',
      guildOnly: true,
      description: 'Allows user to suggest an idea to the bot owner.',
      args: [
        {
          key: 'ideatext',
          label: 'ideatext',
          prompt: 'You need to supply some text to report a bug!',
          type: 'string',
          error: 'The text you supplied was not valid.',
        },
      ],
    });
  }

  async run(msg, { ideaText }, fromPattern, something) {
    const stuff = ideaText.split(/ +/);
    if (wordFilter(ideaText)) { return msg.reply('As these ideas are posted to the public support server they can not contain any rude / malicious content.').catch(console.error); }
    const guild = this.client.guilds.cache.find((guildA) => guildA.id === '714229000129609781');
    const channel = guild.channels.cache.find((channelA) => channelA.id === '714598214975619128');
    const adminChannel = guild.channels.cache.find((channelB) => channelB.id === '714598311918567453');
    const messageContent = stuff.join(' ');
    const reply = new MessageEmbed()
      .setColor(this.client.setting.colour)
      .setFooter(this.client.setting.footer)
      .setTimestamp()
      .setTitle(`Thank you so much ${msg.member.displayName}!`)
      .setDescription('Your suggestion has been sent to the support server and is viewable in the #suggestions channel 💯.');
    msg.say(reply).catch(console.error);
    const embed = new MessageEmbed()
      .setTimestamp()
      .setTitle('New suggestion')
      .setDescription(messageContent)
      .setColor(this.client.setting.colour)
      .setFooter(this.client.setting.footer);
    channel.send(embed).catch(console.error);
    embed
      .setTitle(`New suggestion from ${msg.member.displayName}`)
      .addField('Suggestion made by', `${msg.author.username}#${msg.author.discriminator} - ${msg.author.id}`, true)
      .addField('\u200b', '\u200b', true)
      .addField('From the guild', `${msg.guild.name} - ${msg.guild.id}`)
      .setThumbnail(msg.author.avatarURL({ size: 128 }));
    return adminChannel.send(embed).catch(console.error);
  }
};
