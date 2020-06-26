const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');
const { http } = require('../../functions/API');

module.exports = class randomMeme extends Command {
  constructor(client) {
    super(client, {
      name: 'r-meme',
      aliases: ['meme', 'rm'],
      group: 'reddit',
      memberName: 'random-meme',
      description: 'Gets a random meme from r/memes.',
      guildOnly: false,
      nsfw: true,
    });
  }

  async run(msg, args, fromPattern, result) {
    const content = await http('https://www.reddit.com/r/memes/random/.json');
    const { permalink } = content[0].data.children[0].data;
    const memeUrl = `https://reddit.com${permalink}`;
    const memeImage = content[0].data.children[0].data.url;
    const { author } = content[0].data.children[0].data;
    const memeTitle = content[0].data.children[0].data.title;
    const memeUpvotes = content[0].data.children[0].data.ups;
    const memeNumComments = content[0].data.children[0].data.num_comments;
    const embed = new MessageEmbed();
    embed
      .addField(`Posted by: ${author}`, `[View thread](${memeUrl})`)
      .setImage(memeImage)
      .setColor(this.client.setting.colour)
      .setFooter(this.client.setting.footer)
      .setTitle(memeTitle)
      .setFooter(`👍  ${memeUpvotes}  💬  ${memeNumComments}`);

    msg.channel.send(embed).catch(console.error);
  }
};
