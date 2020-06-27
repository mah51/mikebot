const { MessageEmbed } = require('discord.js');
const ms = require('ms');
const Command = require('../../structures/commands');

module.exports = class getCurrency extends Command {
  constructor(client) {
    super(client, {
      name: 'get-balance',
      aliases: [
        'currency',
        'gb',
        'bal',
      ],
      group: 'currency',
      memberName: 'get-currency',
      description: 'Get a users current balance.',
      details: '',
      examples: [
        'get-balance',
        'get-balance @Mikerophone',
      ],
      args: [
        {
          key: 'member',
          label: 'member',
          prompt: 'Which member would you like to get the balance of?',
          type: 'member',
          default: '',
        },
      ],
      guildOnly: true,
    });
  }

  async run(msg, { member }, fromPattern, something) {
    let memberReq = msg.member;
    if (member) { memberReq = member; }
    if (memberReq.user.bot) { return msg.reply('Bot users do not have any balance.'); }
    const memberInfo = await this.client.membersData.findOne({ id: memberReq.id, guildID: memberReq.guild.id });
    if (!memberInfo || memberInfo.balance === 0) { return this.makeError(msg, `${memberReq.displayName} does not have any currency`); }
    const embed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setThumbnail(memberReq.user.displayAvatarURL())
      .setTitle(`Currency data for ${memberReq.displayName}`)
      .addField('Balance', memberInfo.balance, true)
      .addField('\u200b', '\u200b', true)
      .addField('XP', memberInfo.xp, true)
      .addField('Messages counted', memberInfo.messageCount, true)
      .addField('\u200b', '\u200b', true)
      .addField('Time in the server', ms(Date.now() - memberReq.joinedAt, { long: true }), true);
    return msg.say(embed).catch(console.error);
  }
};
