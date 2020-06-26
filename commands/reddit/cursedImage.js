const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');
const { http } = require('../../functions/API');

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
    const content = await http('https://www.reddit.com/r/cursedimages/random.json');
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
