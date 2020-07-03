const axios = require('axios');
const Command = require('../../structures/commands');

module.exports = class XKCDCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'comic',
      aliases: [
        'xkcd',
      ],
      group: 'fun',
      memberName: 'comic',
      fullName: 'XKCD Comic',
      description: 'Gets a comic from XKCD.',
      details: '',
      examples: [

      ],
      args: [
        {
          key: 'comic',
          label: 'comic',
          prompt: 'Which comic do you want? the default is random',
          default: '',
          type: 'string',
        },
      ],
      guildOnly: false,
    });
  }

  async run(msg, args, fromPattern, something) {
    const comic = args.comic.toLowerCase();
    if (comic === 'today' || comic === 'daily') {
      const data = await axios.get('https://xkcd.com/info.0.json');
      const body = data.data;
      if (!body || !body.num) return this.bot.embed('❌ Error', "Couldn't send the comic. Try again later.", msg, 'error');
      const embed = this.client.embeds('general')
        .setTitle(`💭 ${body.safe_title} 💭`)
        .setDescription(`${body.alt}`)
        .setAuthor(`Comic for ${msg.member.displayName}`, msg.author.displayAvatarURL())
        .setImage(body.img);
      return msg.say(embed).catch(console.error);
    }

    // Gets specified comic
    if (comic.length) {
      const data = await axios.get(`https://xkcd.com/${comic}/info.0.json`);
      const body = data.data;
      if (!body || !body.num) return this.bot.embed('❌ Error', 'Comic not found.', msg, 'error');
      const embed = this.client.embeds('general')
        .setTitle(`💭 ${body.safe_title} 💭`)
        .setDescription(`${body.alt}`)
        .setAuthor(`Comic for ${msg.member.displayName}`, msg.author.displayAvatarURL())
        .setImage(body.img);
      return msg.say(embed).catch(console.error);
    }

    // Random comic
    let data = await axios.get('https://xkcd.com/info.0.json');
    let body = data.data;
    const random = Math.floor(Math.random() * body.num) + 1;
    data = await axios.get(`https://xkcd.com/${random}/info.0.json`);
    body = data.data;
    if (!body || !body.num) return this.bot.embed('❌ Error', "Couldn't send the comic. Try again later.", msg, 'error');

    const embed = this.client.embeds.create('general')
      .setTitle(`💭 ${body.safe_title} 💭`)
      .setDescription(`${body.alt}`)
      .setAuthor(`Comic for ${msg.member.displayName}`, msg.author.displayAvatarURL())
      .setImage(body.img);
    return msg.say(embed).catch(console.error);
  }
};
