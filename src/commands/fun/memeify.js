const path = require('path');
const Command = require('../../structures/commands');
const { pooh, spongeBob } = require('../../functions/memeFunctions/pooh');

module.exports = class Memeify extends Command {
  constructor(client) {
    super(client, {
      name: 'meme-creator',
      aliases: [
        'make-meme',
        'mm',
        'm-c',
      ],
      userPermissions: ['ATTACH_FILES'],
      group: 'fun',
      memberName: 'memeify',
      description: 'Creates a meme from a choice of templates, (Work in progress)',
      examples: [
        'meme-creator winnie-the-pooh',
      ],
      args: [
        {
          key: 'meme',
          label: 'meme',
          prompt: 'What meme template would you like to use?',
          type: 'string',
        },
      ],
      guildOnly: false,
      deleteStatus: false,
    });
  }

  async run(msg, { meme }, fromPattern, result) {
    if (!this.checkChannelPerms(msg, msg.channel, msg.guild.me, ['SEND_MESSAGES', 'ATTACH_FILES'])) { return; }
    switch (meme) {
      case 'pooh':
      case 'winnie-the-pooh':
        await pooh(msg, [700, 555], path.join(__dirname, '../../assets/images/meme-templates/winnie-the-pooh.png'), [350, 135], [350, 400], 35, 0.4);
        break;
      case 'mock':
      case 'spongebob-mocking':
        await spongeBob(msg);
        break;
      default:
        msg.reply('That template wasn\'t recognised, try any of the following: `winnie-the-pooh (pooh)`, `spongebob-mocking (mock)`').catch(console.error);
        break;
    }
  }
};
