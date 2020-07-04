const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const Command = require('../../structures/commands');

module.exports = class UserInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'user-info',
      aliases: ['user', 'ui'],
      group: 'info',
      memberName: 'user-info',
      description: 'Gets information about a user.',
      examples: ['user-info @Mikerophone'],
      guildOnly: true,
      args: [
        {
          key: 'member',
          label: 'member',
          prompt: 'The user\' s tag',
          type: 'member',
          default: '',
          error: 'The user wasn\'t found... send their discord tag or type their username!',
        },
      ],

    });
  }

  async run(msg, args, fromPattern, something) {
    let { member } = args;
    if (!args.member) {
      member = msg.member;
    }
    const { user } = member;
    const foods = ['Chicken, just chicken', 'How am I meant to know? \nI\'m a bot.', 'Probably pizza', 'Human flesh',
      'Literally anything have you seen the size of them?', 'one whole roast turkey', 'a glass of water'];
    const embed = new MessageEmbed()
      .setTitle(`Server info for **${user.username}#${user.discriminator}**`)
      .setTimestamp()
      .setThumbnail(user.displayAvatarURL({ size: 2048 }))
      .setColor(this.client.setting.colour)
      .setFooter(this.client.setting.footer)
      .setDescription('**Member Details**')
      .addFields([
        { name: 'Nickname', value: `${member.nickname ? ` Nickname: ${member.nickname}` : 'No nickname'}` },
        { name: 'Roles: ', value: `${member.roles.cache.map((roles) => `\`${roles.name}\``).join(', ')}` },
        { name: 'Server join:', value: moment(user.createdAt).format('[Date - ]DD.MM.YY [  Time - ]HH:mm:ss') },
        { name: 'Been in the server for:', value: `${moment.duration(moment().diff(moment(member.joinedAt))).humanize(false)}` },
      ]);

    let fieldName; let
      fieldValue;
    const embed1 = new MessageEmbed();
    if (typeof user.presence.activities === 'undefined' || user.presence.activities.length < 1) {
      fieldName = 'User activity: ';
      fieldValue = 'None';
    } else if (user.presence.activities[0].name === 'Spotify') {
      fieldName = 'Listening to Spotify 🎵';
      fieldValue = `Song - ${user.presence.activities[0].details} by ${user.presence.activities[0].state.split(';')[0]}`;
      embed1.setThumbnail(user.presence.activities[0].assets.largeImageURL({ size: 128 }));
    } else if (user.presence.activities[0].type === 'LISTENING') {
      fieldName = 'Listening to: ';
      fieldValue = user.presence.activities[0].name;
    } else if (user.presence.activities[0].type === 'PLAYING') {
      fieldName = 'Playing: ';
      fieldValue = `${user.presence.activities[0].details}`;
    } else if (user.presence.activities[0].type === 'WATCHING') {
      fieldName = 'Watching: ';
      fieldValue = `${user.presence.activities[0].details}`;
    }
    embed1
      .setTimestamp()
      .setColor(this.client.setting.colour)
      .setFooter(this.client.setting.footer)
      .setDescription('**User Details**');
    user.bot ? embed1.addField('Bot: ', 'True', true) : '';
    embed1.addFields([
      { name: 'Status: ', value: `${user.presence.status[0].toUpperCase() + user.presence.status.slice(1)}` },
      { name: fieldName, value: fieldValue },
      { name: 'Creation date: ', value: `${moment(user.createdAt).format('[Date - ]DD.MM.YY [  Time - ]HH:mm:ss')}` },
      { name: 'Age of account: ', value: moment.duration(moment().diff(moment(user.createdAt))).humanize(false) },
      { name: 'Favourite food', value: `${user.bot ? 'Bots don\'t eat!' : foods[Math.floor(Math.random() * foods.length)]}` },
    ]);

    return msg.channel.send({ embed }).then(() => {
      msg.channel.send({ embed: embed1 }).catch(console.error);
    }).catch(console.error);
  }
};
