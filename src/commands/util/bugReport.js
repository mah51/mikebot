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
    this.makeSuccess(msg, 'Do you have an error code to submit? Type no if you have no code, or type cancel to cancel this report.');
    const filter = (res) => {
      if (res.author.id !== msg.author.id) return false;
      if (res.content.toLowerCase() === 'cancel') return true;
      return res.content.toLowerCase() !== 'no';
    };
    const codeMsg = await msg.channel.awaitMessages(filter, {
      max: 1,
      time: 30000,
    });
    let codePresent = true;
    if (!codeMsg.size) {
      this.makeError(msg, 'You didn\'t send the code in time, I will send the message without a code!');
      codePresent = false;
    }
    if (codeMsg.first().content.length !== 7) {
      this.makeError(msg, 'That didn\'t seem to match up as a valid code, but I will send the message without a code anyway!');
      codePresent = false;
    }
    if (codeMsg.first().content === 'cancel') {
      return msg.reply('Command was cancelled');
    }
    if (codeMsg.first().content === 'no') {
      codePresent = false;
    }
    const errorEmbed = new MessageEmbed();
    if (codePresent) {
      const error = await this.client.errorsData.findOne({ code: codeMsg.first().content });
      if (!error) {
        this.makeError(msg, 'Error was not found, the code might have been incorrect, I am sending the report anyway...');
        codePresent = false;
      }
      errorEmbed
        .setFooter(this.client.setting.footer)
        .setColor(this.client.setting.colour)
        .setTimestamp(error.error.timestamp)
        .setTitle('⚠ Error provided.')
        .setDescription(`
**Command:** ${error.error.cmdName}
**Error:** ${error.error.errName}
${error.error.errInfo}
        `)
        .addField('Guild id', error.guildID, true)
        .addField('User id', error.userID, true);
    }
    const reply = new MessageEmbed()
      .setColor(this.client.setting.colour)
      .setFooter(this.client.setting.footer)
      .setTimestamp()
      .setAuthor(`Thank you so much ${msg.member.displayName}!`, msg.author.displayAvatarURL())
      .setDescription('The bug report has been logged and the owner will look into it ASAP.');
    // eslint-disable-next-line no-unused-expressions
    codePresent ? reply.addField('Code sent', codeMsg.first().content, true) : '';
    msg.say(reply).catch(console.error);
    const embed = new MessageEmbed()
      .setTimestamp()
      .setDescription(messageContent)
      .setColor(this.client.setting.colour)
      .setFooter(this.client.setting.footer)
      .setAuthor(`New bug report from ${msg.author.username}`, msg.author.displayAvatarURL())
      .addField('Bug report sent by', `${msg.author.username}#${msg.author.discriminator} - id: ${msg.author.id}`, true)
      .addField('\u200b', '\u200b', true)
      .addField('From the guild', `${msg.guild.name} - ${msg.guild.id}`, true);

    adminChannel.send(embed).catch(console.error);
    // eslint-disable-next-line no-unused-expressions
    codePresent ? adminChannel.send(errorEmbed).catch(() => {}) : '';
    return msg;
  }
};
