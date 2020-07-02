const { Command } = require('discord.js-commando');
const { MessageEmbed, escapeMarkdown } = require('discord.js');

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const permissions = {
  ADMINISTRATOR: 'Administrator',
  VIEW_AUDIT_LOG: 'View audit log',
  MANAGE_GUILD: 'Manage server',
  MANAGE_ROLES: 'Manage roles',
  MANAGE_CHANNELS: 'Manage channels',
  KICK_MEMBERS: 'Kick members',
  BAN_MEMBERS: 'Ban members',
  CREATE_INSTANT_INVITE: 'Create instant invite',
  CHANGE_NICKNAME: 'Change nickname',
  MANAGE_NICKNAMES: 'Manage nicknames',
  MANAGE_EMOJIS: 'Manage emojis',
  MANAGE_WEBHOOKS: 'Manage webhooks',
  VIEW_CHANNEL: 'Read text channels and see voice channels',
  SEND_MESSAGES: 'Send messages',
  SEND_TTS_MESSAGES: 'Send TTS messages',
  MANAGE_MESSAGES: 'Manage messages',
  EMBED_LINKS: 'Embed links',
  ATTACH_FILES: 'Attach files',
  READ_MESSAGE_HISTORY: 'Read message history',
  MENTION_EVERYONE: 'Mention everyone',
  USE_EXTERNAL_EMOJIS: 'Use external emojis',
  ADD_REACTIONS: 'Add reactions',
  CONNECT: 'Connect',
  SPEAK: 'Speak',
  MUTE_MEMBERS: 'Mute members',
  DEAFEN_MEMBERS: 'Deafen members',
  MOVE_MEMBERS: 'Move members',
  USE_VAD: 'Use voice activity',
};
class MikeBotCommand extends Command {
  constructor(client, info) {
    super(client, info);
    this.deleteStatus = typeof info.deleteStatus === 'boolean' ? info.deleteStatus : true;
    this.userRoles = info.userRoles || null;
    this.fullName = info.fullName || null;
    this.uses = 0;
    this.errors = [];
    this.errorCount = 0;
    this.credit = info.credit || [];
  }

  async getData(message) {
    const data = {};
    data.guild = await this.client.findGuild({ id: message.guild.id });
    data.memberData = await this.client.findMember({ id: message.author.id, guildID: message.guild.id });
    return data;
  }

  hasPermission(message, ownerOverride = true) {
    if (!this.ownerOnly && !this.userPermissions && !this.userRoles) return true;
    if (ownerOverride && this.client.isOwner(message.author)) return true;

    if (this.ownerOnly && (ownerOverride || !this.client.isOwner(message.author))) {
      return 'owner-only';
    }

    if (message.channel.type === 'text' && (this.userPermissions || this.userRoles)) {
      const userRoles = this.userRoles ? this.userRoles.map((clientRole) => clientRole.toLowerCase()) : [];
      if (message.member.roles.cache.find((role) => userRoles.includes(role.name.toLowerCase()))) {
        return true;
      }
      return 'Missing some perms';
    }

    return true;
  }

  onBlock(message, reason, data) {
    const embed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.errorcolour)
      .setFooter(message.member ? message.member.displayName : message.author.username, message.author.displayAvatarURL())
      .setAuthor(`${this.group.name} - ${this.name.slice(0, 1).toUpperCase() + this.name.split('').splice(1).join('')}`)
      .setTimestamp();
    switch (reason) {
      case 'guildOnly':
        embed.setDescription(`\`❌\` The \`${this.name}\` command must be used in a server channel.`);
        return message.say({ embed }).catch(console.error);
      case 'nsfw':
        embed.setDescription(`\`❌\` The \`${this.name}\` command can only be used in NSFW channels.`);
        return message.say({ embed }).catch(console.error);
      case 'permission': {
        if (data.response === 'owner-only') {
          embed.setDescription(`The \`${this.name}\` command can only be used by the bot owner.`);
          return message.say({ embed }).catch(console.error);
        }
        embed.setDescription(`\`❌\` ${message.member} does not have permissions to use the **${this.name}** command`)
          .addField('Permissions needed', `\`${this.userPermissions ? `${this.userPermissions.map((perm) => permissions[perm]).join('`, `')}` : 'No permissions'}\``, true)
          .addField('Roles needed', `\`${this.userRoles ? `${this.userRoles.join('`, `')}` : 'No roles'}\``, true);
        return message.say({ embed }).catch(console.error);
      }
      case 'clientPermissions': {
        embed.setDescription(`\`❌\` ${message.client.user.username} **needs permissions** to execute the **${this.name}** command`)
          .addField('Permissions needed', `${data.missing.map(((perm) => permissions[perm]).join('`, `')``)}`);
        return message.say({ embed }).catch(console.error);
      }
      case 'throttling': {
        embed.setDescription(`\`❌\`You may not use the \`${this.name}\` command again for another ${data.remaining.toFixed(1)} seconds`)
          .addField('You can use this command', `${this.throttling.usages} times every ${this.throttling.duration} seconds`);
        return message.say({ embed });
      }
      default:
        return null;
    }
  }

  makeSuccess(msg, success) {
    const embed = new MessageEmbed()
      .setColor(this.client.setting.successcolour)
      .setDescription(success);
    return msg.reply(embed).catch(console.error);
  }

  makeError(msg, error) {
    const embed = new MessageEmbed()
      .setColor(this.client.setting.errorcolour)
      .setDescription(`${msg.author}, ${error}`);
    return msg.say(embed).catch(console.error);
  }

  checkChannelPerms(msg, channel, member, permNames) {
    const perms = channel.permissionsFor(member);
    if (perms.has(permNames)) { return true; }
    const permArray = perms.toArray();
    const missingPerms = permNames.map((perm) => (permArray.includes(perm) ? '' : perm));
    const embed = new MessageEmbed()
      .setFooter(msg.client.user.username, msg.client.user.displayAvatarURL())
      .setColor(this.client.setting.errorcolour)
      .setTimestamp()
      .setAuthor(`${this.group.name} -  ${this.name.slice(0, 1).toUpperCase() + this.name.split('').splice(1).join('')}`)
      .setDescription(`\`❌\` ${msg.client.user.username} **needs permissions** to execute the **${this.name}** command in ${channel.name}`)
      .addField('Permissions needed', `\`${missingPerms.filter((perm) => perm !== '').map((perm) => `${perm.split('_').map((thing) => thing[0].toUpperCase() + thing.toLowerCase().slice(1, perm.length)).join(' ')}`).join('`, `')}\``, false);
    msg.say({ embed }).catch(console.error);
    return false;
  }

  onError(err, msg, args, fromPattern, result) {
    this.errorCount += 1;
    this.errors.push({ author: msg.author.username, content: msg.content, error: err });
    const { owners } = this.client;
    const ownerList = owners ? owners.map((usr, i) => {
      const or = i === owners.length - 1 && owners.length > 1 ? 'or ' : '';
      return `${or}${escapeMarkdown(usr.username)}#${usr.discriminator}`;
    }).join(owners.length > 2 ? ', ' : ' ') : '';
    const code = makeid(7);
    const { invite } = this.client.options;
    const errorData = new this.client.errorsData({
      code,
      guildID: msg.guild ? msg.guild.id : `${msg.channel.id} dm`,
      userID: msg.author.id,
      commandName: msg.command.fullName || msg.command.name,
      error:
        {
          cmdName: msg.command.name,
          errName: err.name,
          errInfo: err.message,
          timestamp: msg.createdTimestamp,
        },
    });
    const embed = new MessageEmbed();
    return errorData.save()
      .then(() => {
        embed
          .setFooter('Sorry about that!', msg.client.user.displayAvatarURL())
          .setColor(this.client.setting.errorcolour)
          .setAuthor(`${msg.member.displayName} an error occurred!`, msg.author.displayAvatarURL())
          .setTimestamp()
          .setDescription(`\u200b\n\`❌\` **Uh oh!** an error occurred using the \`${msg.command.fullName || msg.command.name}\` command 😭\n**Please report this problem** (otherwise the owner won't be aware of it!)\n\u200b`)
          .addField('Reporting with `.bug`', `Use \`${msg.guild.commandPrefix}bug\` to report this bug\nPlease submit this code when asked for it: \`${code}\`\n\u200b`, true)
          .addField('Reporting in the support server', `You can join the [support server](${invite}) and message \`${ownerList}\``, true);
        return msg.say(embed).catch(console.error);
      })
      .catch(console.error);
  }
}

module.exports = MikeBotCommand;
