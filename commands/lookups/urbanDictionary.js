const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');
const { http, queryFormatter } = require('../../functions/API');

module.exports = class UrbanDictionary extends Command {
  constructor(client) {
    super(client, {
      name: 'urban-dictionary',
      aliases: ['ud', 'urban-lookup', 'urbandictionary', 'urban'],
      group: 'lookups',
      memberName: 'urban-dictionary',
      description: 'Search for an urban dictionary term',
      examples: ['urban-dictionary Mikerophone', 'ud MikeBot'],
      nsfw: true,
      args: [
        {
          key: 'query',
          prompt: 'Enter the term you would like to search.',
          type: 'string',
        },
      ],
    });
  }

  async run(msg, { query }, fromPattern, something) {
    const queryS = queryFormatter(query);
    const req = await http(`http://api.urbandictionary.com/v0/define?term=${queryS}`);
    if (req.list.length === 0) {
      await msg.say("That word isn't on urban dictionary. Sort it out");
    } else if (req === 'undefined') {
      await msg.say("Urban dictionary's api did not respond 😢");
    } else {
      const reqs = req.list[Math.round(Math.random() * req.list.length)];

      const embed = new MessageEmbed();
      embed
        .setColor(this.client.setting.colour)
        .setFooter(this.client.setting.footer)
        .setTimestamp()
        .setTitle(`Urban dictionary - ${reqs.word}`)
        .setDescription(`Definition - ${reqs.definition}`)
        .setAuthor(`Author - ${reqs.author}`)
        .addFields([
          { name: 'Example', value: `${reqs.example}\n\u200b` },
          { name: '👍', value: reqs.thumbs_up, inline: true },
          { name: '👎', value: reqs.thumbs_down, inline: true },
        ]);

      return msg.say(embed).catch(console.error);
    }
  }
};
