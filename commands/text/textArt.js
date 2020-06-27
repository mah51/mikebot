const { MessageEmbed } = require('discord.js');
const figlet = require('figlet');
const Command = require('../../structures/commands');

module.exports = class textArt extends Command {
  constructor(client) {
    super(client, {
      name: 'word-art',
      aliases: [
        'wa',
      ],
      group: 'text',
      memberName: 'text-art',
      description: 'Turns text into word art. (Doesn\'t work on mobile)',
      details: '',
      examples: [
        'word-art mikebot',
      ],
      args: [
        {
          key: 'string',
          label: 'string',
          prompt: 'What text would you like to convert to word art?',
          type: 'string',
        },
      ],
      guildOnly: true,
    });
  }

  async run(msg, { string }, fromPattern, something) {
    figlet(string, (err, data) => {
      if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
      }
      if (data.split('').length > 1999) { msg.reply('That message was too long! Discord does not allow messages over 2000 characters long :(').catch(console.error); }
      msg.reply(`\n\`\`\`${data}\`\`\``);
    });
    return null;
  }
};
