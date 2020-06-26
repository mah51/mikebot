const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');

module.exports = class unMute extends Command {
  constructor(client) {
    super(client, {
      name: 'un-mute',
      aliases: [

      ],
      group: 'moderation',
      memberName: 'un-mute',
      description: 'Un mute a member',
      details: '',
      userPermissions: ['MANAGE_MESSAGES'],
      clientPermissions: ['MANAGE_MESSAGES'],
      examples: [

      ],
      args: [
        {
          key: 'member',
          label: 'member',
          prompt: 'Which member would you like to unmute.',
          type: 'member',
        },

      ],
      guildOnly: true,
    });
  }

  async run(msg, { member }, fromPattern, something) {
    const memberData = await this.client.findMember({ id: member.id, guildID: msg.guild.id });
    const embed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setTitle('🔊 UNMUTED 🔊')
      .setDescription(`Successfully unmuted ${member.displayName}`);

    if (memberData.mute.muted) {
      memberData.mute.endDate = Date.now();
      memberData.markModified('mute');
      memberData.save();
      msg.say(embed).catch(console.error);
    } else {
      msg.say(await this.error('User is not muted!')).catch(console.error);
    }
  }
};
