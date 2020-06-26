const { MessageEmbed } = require('discord.js');

module.exports = async (content, message, server, channel, user) => {
  const emb = new MessageEmbed()
    .setTitle('ARE YOU SURE YOU WANT TO SEND THIS MESSAGE?')
    .setDescription(`It is being sent to ${server ? `Server: ${server}` : ''} ${channel ? ` - Channel: ${channel}` : ''} ${user ? ` - User: ${user}` : ''}`)
    .addField('Message Content', content)
    .setColor(message.client.setting.colour);
  const filter = (reaction, user_) => reaction.emoji.name === '✅' && user_.id === message.author.id;

  // send embed and create reaction listener
  return message.reply(emb)
    .then((msg) => {
      msg.react('✅');
      return msg.awaitReactions(filter, { max: 1, time: 20000, errors: ['time'] })
        .then((collected) => collected.size === 1)
        .catch((collected) => console.log(collected.size));
    })
    .catch(console.error);
};
