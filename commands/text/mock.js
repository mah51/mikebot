const { MessageEmbed } = require('discord.js');
const path = require('path');
const Command = require('../../structures/commands');

module.exports = class mockCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'mock',
      aliases: ['random-case'],
      group: 'text',
      memberName: 'mock',
      description: 'uSe ThIS cOmmanD To mOCK QuOteS',
      examples: ["randomCase spongebob isn't cool"],

      args: [
        {
          key: 'text',
          prompt: 'Provide text or a user to mock!',
          type: 'string',
        },
      ],
    });
  }

  async run(msg, { text }, fromPattern, something) {
    let member;
    const query = text.split(/ +/)[0];
    if (query.startsWith('<@')) {
      const userID = query.split('').slice(3, -1).join('');
      member = await msg.guild.members.fetch(userID).catch(console.error);
      if (!member) { return msg.reply('That user could not be found!').catch(console.error); }
      if (member.id === this.client.user.id) {
        msg.channel.startTyping().catch(console.error);
        return msg.reply('hAHa LEtS MoCK tHe bOt tHaT WIlL bE fuNnY...\n', {
          files: [
            path.join(__dirname, '../../assets/gifs/turntables.gif'),
          ],
        }).then(() => msg.channel.stopTyping()).catch(console.error);
      }
      const messages = await msg.channel.messages.fetch({ limit: 15 }, false).catch(console.error);
      let messageFound = '';
      messages.forEach((message) => {
        if (!messageFound) {
          if (message.author.id === member.id) {
            messageFound = message;
          }
        }
      });
      if (!messageFound) { return msg.reply('The message couldn\'t be found. The bot only searches the last 14 messages in this channel!').catch(console.error); }

      text = messageFound.content;
      if (!text) { return msg.reply('That message doesn\'t have any content! I don\'t read embeds or attachments.').catch(console.error); }
    }

    msg.delete().catch(console.error);
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    const msgString = text.toLowerCase();
    let randomCaseString = '';
    let letter;
    for (let i = 0; i < msgString.length; i += 1) {
      if (alphabet.indexOf(msgString[i]) !== -1) {
        const randomNumber = Math.floor(Math.random() * 2);

        // eslint-disable-next-line default-case
        switch (randomNumber) {
          case 0:
            letter = msgString[i].toLowerCase();
            break;
          case 1:
            letter = msgString[i].toUpperCase();
        }
      } else {
        letter = msgString[i];
      }
      randomCaseString += letter;
    }
    const embed = new MessageEmbed()
      .setDescription(randomCaseString)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setFooter(`Mocked by ${msg.member ? msg.member.displayName : msg.author.username}`);
    // eslint-disable-next-line no-unused-expressions
    member ? embed.setTitle(`${member.displayName} was mocked!`) : '';

    return msg.channel.send(embed).catch(console.error);
  }
};
