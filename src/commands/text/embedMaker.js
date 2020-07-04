const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');

module.exports = class embedMaker extends Command {
  constructor(client) {
    super(client, {
      name: 'make-embed',
      aliases: [
        'm-e',
      ],
      group: 'text',
      memberName: 'make-embed',
      description: 'Makes an embed from provided text.',
      details: '',
      examples: [
        '.m-e "Title" "Description"',
      ],
      args: [
        {
          key: 'title',
          label: 'title',
          prompt: 'What would you like the title of the embed to be?',
          type: 'string',
        },
        {
          key: 'description',
          label: 'description',
          prompt: 'What would you like the description of them embed to be?',
          type: 'string',
        },
        {
          key: 'fields',
          label: 'fields',
          prompt: 'Would you like fields on the embed? if not leave blank, make sure to seperate name value pair with | (vertical bar character), so two fields would look like name1|val1 name2|val2, fields are by default inline but if you want that set to false do name2|val2|false(or any value here)',
          type: 'string',
          infinite: true,
        },
      ],
      guildOnly: true,
    });
  }

  async run(msg, { title, description, fields }, fromPattern, something) {
    let fieldArray;
    if (fields) {
      fieldArray = fields.map((field) => field.split('|'));
    }

    const embed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setAuthor(msg.member.displayName, msg.author.avatarURL({ size: 64 }))
      .setTitle(title)
      .setDescription(description);
    fieldArray.forEach((field) => {
      embed.addField(field[0], field[1], !(field.length > 2));
    });
    msg.say(embed).catch(console.error);
  }
};
