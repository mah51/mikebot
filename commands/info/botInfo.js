const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const Command = require('../../structures/commands');

module.exports = class botInfo extends Command {
  constructor(client) {
    super(client, {
      name: 'bot-info',
      aliases: ['bi', 'botinfo'],
      group: 'info',
      memberName: 'bot-info',
      description: 'Provides information about the bot',
    });
  }

  async run(msg, args, fromPattern, something) {
    const createdAt = moment(this.client.user.createdAt).format('DD.MM.YY [at] HH:mm:ss');
    const serverJoin = moment.duration(moment().diff(moment(msg.guild.me.joinedAt))).humanize(false);
    const embed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTitle(`Hi, my name is ${this.client.user.username}`)
      .setDescription('I was created by Mikerophone#0001')
      .setTimestamp()
      .setThumbnail(msg.client.user.avatarURL({ size: 512 }));

    msg.guild.me.nickname ? embed.addField('My nickname on this server is:', msg.guild.me.nickname, true) : '';

    embed
      .addField('I was created on:', createdAt, false)
      .addField('I have been in this server for:', serverJoin, false)
      .addField('Roles:', msg.guild.me.roles.cache.map((roles) => `\`${roles.name}\``).join(', '), false)
      .addField('Servers:', `I am currently in ${this.client.guilds.cache.size} servers 💯`, true)
      .addField('\u200B', '\u200B', true)
      .addField('\u200B ❤', '[Support Server!](https://discord.gg/UmXUUaA) or [Website](https://mikebot.xyz)', true);
    msg.reply(embed).catch(console.error);
  }
};
