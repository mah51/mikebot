const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');

module.exports = class StealCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'steal',
      aliases: [

      ],
      group: 'currency',
      memberName: 'steal',
      description: 'Steal from a member but hope they aren\'t on the ball.',
      details: '',
      examples: [
        'steal @Mikerophone high',
      ],
      args: [
        {
          key: 'member',
          label: 'member',
          prompt: 'Which member would you like to steal from?',
          type: 'member',
        },
        {
          key: 'risk',
          label: 'risk',
          prompt: 'What risk would you like to take low, medium, or high?',
          type: 'string',
          error: 'Provide either low, medium, or high as an argument',
          validate: (query) => ['low', 'medium', 'high'].includes(query.toLowerCase()),
        },
      ],
      guildOnly: true,
    });
  }

  async run(msg, { member, risk }, fromPattern, something) {
    const time = {
      low: [5, 20],
      medium: [20, 50],
      high: [50, 150],
    };
    if (msg.author.id === member.id) { return msg.reply('You can\'t steal from yourself...'); }
    const activeSteals = this.client.steals.get(msg.guild.id + msg.member.id);
    if (activeSteals) { return msg.reply('You are currently stealing from someone...').catch(console.error); }
    const thief = await this.client.findMember({ id: msg.member.id, guildID: msg.guild.id });
    const victim = await this.client.findMember({ id: member.id, guildID: msg.guild.id });
    if (member.id === msg.client.user.id) { return this.makeError(msg, '*Stares angrily*').catch(console.error); }
    if (member.user.bot) { return this.makeError(msg, 'Don\'t steal from a bot! They will remember 👀.').catch(console.error); }
    if (!thief || thief.balance < 1) { return this.makeError(msg, `${msg.member.displayName} you don't have any balance`).catch(console.error); }
    if (!victim || victim.balance < 1) { return this.makeError(msg, `${member.displayName} doesn't have any balance`); }
    if (thief.steals.cache.length > 0 && (Date.now() - thief.cooldowns.steal) < 21600000) { return this.makeError(msg, 'You can only steal every 6 hours!').catch(console.error); }
    msg.channel.send(`${member}, You have ${time[risk.toLowerCase()][0]} seconds to react to this message or you will get stolen from!`)
      .then(async (message) => {
        await this.client.steals.set(msg.guild.id + msg.member.id, true);
        await message.react('⚔️');
        const filter = (reaction, user) => user.id === member.id;
        message.awaitReactions(filter, { time: time[risk.toLowerCase()][0] * 1000, max: 1 })
          .then(async (collected) => {
            const embed = new MessageEmbed()
              .setFooter(this.client.setting.footer)
              .setColor(this.client.setting.colour)
              .setTimestamp();
            const thiefObj = {
              money: time[risk.toLowerCase()][1],
              time: Date.now(),
              otherMember: member.id,
            };
            const victimObj = {
              money: time[risk.toLowerCase()][1],
              time: Date.now(),
              otherMember: msg.member.id,
            };
            if (thief.steals.cache.length > 9) { thief.steals.shift(); }
            if (victim.stolen.cache.length > 9) { thief.stolens.shift(); }
            if (collected.size < 1) {
              thief.balance += time[risk.toLowerCase()][1];
              victim.balance -= time[risk.toLowerCase()][1];
              thiefObj.success = true;
              victimObj.success = true;
              thief.steals.successCount += 1;
              thief.steals.stealCount += 1;
              victim.stolen.stolenCount += 1;
              thief.steals.cache.unshift(thiefObj);
              victim.stolen.cache.unshift(victimObj);
              embed
                .setTitle('Thief was successful!')
                .setDescription(`${msg.member.displayName} stole $${time[risk.toLowerCase()][1]} from ${member.displayName}`);
            } else {
              thief.balance -= 25;
              victim.balance += 25;
              thiefObj.success = false;
              thief.steals.stealCount += 1;
              victimObj.success = false;
              thief.steals.cache.unshift(thiefObj);
              victim.stolen.cache.unshift(victimObj);
              embed
                .setColor('#FF5251')
                .setTitle('Steal was unsuccessful!')
                .setDescription(`${msg.member.displayName} tried to steal from ${member.displayName} and got caught! They were fined for $25.`);
            }
            thief.cooldowns.steal = Date.now();
            thief.markModified('cooldowns.steal');
            thief.markModified('steals');
            victim.markModified('stolen');
            await thief.save();
            await victim.save();
            await this.client.steals.delete(msg.guild.id + msg.member.id);
            msg.reply(embed).catch(console.error);
          }).catch(console.error);
      }).catch(console.error);
    return null;
  }
};
