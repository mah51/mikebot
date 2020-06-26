const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = async (client) => {
  if (client.membersData === undefined) return;
  const reminders = await client.membersData.find({ reminders: { $exists: true, $ne: [] } });
  for (const memberData of reminders) {
    const guild = client.guilds.cache.get(memberData.guildID) || await client.guilds.fetch(memberData.guildID);
    // eslint-disable-next-line no-continue
    if (!guild) continue;
    // eslint-disable-next-line no-await-in-loop
    const member = guild.members.cache.get(memberData.id) || await guild.members.fetch(memberData.id).catch(async (err) => {
    });

    // eslint-disable-next-line no-continue
    if (!member) continue;
    for (const reminder of memberData.reminders) {
      if (reminder.time > Date.now()) { continue; }
      // eslint-disable-next-line no-await-in-loop
      const channel = guild.channels.cache.get(reminder.channel) || await guild.channels.fetch(reminder.channel);
      memberData.reminders.splice(memberData.reminders.indexOf(reminder));
      memberData.markModified('reminders');
      await memberData.save();
      if (!channel) {
        return;
      }
      const embed = new MessageEmbed()
        .setFooter(client.setting.footer)
        .setColor(client.setting.colour)
        .setTimestamp()
        .setTitle('REMINDER')
        .setDescription(`Here is a reminder you set ${moment(reminder.setTime).format('LLLL')}`)
        .addField('Message', reminder.message, true);
      channel.send(`${member}`, { embed }).catch(console.error);
    }
  }
};
