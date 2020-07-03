const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const Command = require('../../structures/commands');

module.exports = class Joke extends Command {
  constructor(client) {
    super(client, {
      name: 'r-joke',
      aliases: ['joke', 'rj', 'randomjoke', 'randomj'],
      group: 'reddit',
      memberName: 'random-joke',
      description: 'Gets a random post from r/jokes.',
      guildOnly: false,
      nsfw: true,
    });
  }

  async run(msg, args, fromPattern, result) {
    const req = await axios.get('https://www.reddit.com/r/jokes/random/.json');
    const content = req.data;
    const { permalink } = content[0].data.children[0].data;
    const memeUrl = `https://reddit.com${permalink}`;
    const { title } = content[0].data.children[0].data;
    const memeImage = content[0].data.children[0].data.url;
    const { author } = content[0].data.children[0].data;
    const memeUpvotes = content[0].data.children[0].data.ups;
    const memeNumComments = content[0].data.children[0].data.num_comments;
    const joke = content[0].data.children[0].data.selftext;
    const time = 3;
    const embed = new MessageEmbed()
      .addField(`Posted by: ${author}`, `[View thread](${memeUrl})`)
      .setImage(memeImage)
      .setDescription(`Punchline in ${time} seconds.`)
      .setColor(this.client.setting.colour)
      .setFooter(this.client.setting.footer)
      .setTitle(title)
      .setFooter(`👍  ${memeUpvotes}  💬  ${memeNumComments} - ${this.client.setting.footer}`);

    msg.channel.send(embed).catch(console.error)
      .then((msg) => {
        const interval = setTimeout(() => {
          embed.setDescription(joke);
          clearInterval(interval);
          msg.edit(embed).catch(console.error);
        }, time * 1000);
      });
  }
};
