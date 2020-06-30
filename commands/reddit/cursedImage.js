const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const Command = require('../../structures/commands');

module.exports = class cursedImage extends Command {
  constructor(client) {
    super(client, {
      name: 'r-cursed',
      aliases: ['cursed', 'ci'],
      group: 'reddit',
      memberName: 'random-cursed',
      description: 'Gets a random post from r/cursedimages.',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 10,
      },
      nsfw: true,
    });
  }

  async run(msg, args, fromPattern, result) {
    const content = await axios.get('https://reddit.com/r/cursedimages/random.json');
    const data = content.data[0] ? content.data[0].data.children[0].data : content.data.data.children[0].data;
    const { permalink } = data;
    const memeUrl = `https://reddit.com${permalink}`;
    const { title } = data;
    const memeImage = data.url;
    const { author } = data;
    const memeUpvotes = data.ups;
    const memeNumComments = data.num_comments;
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
