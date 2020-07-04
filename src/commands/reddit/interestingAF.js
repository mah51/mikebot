const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const Command = require('../../structures/commands');

module.exports = class interestingAF extends Command {
  constructor(client) {
    super(client, {
      name: 'r-interest',
      aliases: ['interest', 'im', 'interestme', 'interest-me'],
      group: 'reddit',
      memberName: 'random-interest',
      description: 'Gets a random post from r/interestingasfuck.',
      guildOnly: false,
      nsfw: true,
    });
  }

  async run(msg, args, fromPattern, result) {
    const req = await axios.get('https://www.reddit.com/r/interestingasfuck/random.json');
    const content = req.data;
    const { permalink } = content[0].data.children[0].data;
    const memeUrl = `https://reddit.com${permalink}`;
    const { title } = content[0].data.children[0].data;
    const memeImage = content[0].data.children[0].data.url;
    const { author } = content[0].data.children[0].data;
    const memeUpvotes = content[0].data.children[0].data.ups;
    const memeNumComments = content[0].data.children[0].data.num_comments;
    const embed = new MessageEmbed()
      .addField(`Posted by: ${author}`, `[View thread](${memeUrl})`)
      .setImage(memeImage)
      .setColor(this.client.setting.colour)
      .setFooter(this.client.setting.footer)
      .setTitle(title)
      .setFooter(`👍  ${memeUpvotes}  💬  ${memeNumComments}`);

    return msg.channel.send(embed).catch(console.error);
  }
};
