const path = require('path');
const Command = require('../../structures/commands');

module.exports = class QuotePrinter extends Command {
  constructor(client) {
    super(client, {
      name: 'quote',
      group: 'fun',
      memberName: 'quote',
      description: 'Returns a quote',
      guildOnly: true,
      hidden: true,

      args: [{
        key: 'quote',
        prompt: 'What quote response do you want?',
        type: 'string',
      }],
      examples: [
        'quote <cricket>',
      ],
    });
  }

  async run(msg, { quote }) {
    let trueGuild = false;
    if (msg.guild.id === '689991856930553917') trueGuild = true;
    function playAudio(client, file, vol) {
      if (msg.member.voice.channel === null) {
        msg.channel.send('For a cheeky voice snippet join a voice channel');
        return;
      }
      const queue = client.music.guilds.get(msg.guild.id);
      if (queue && queue.audioDispatcher) {
        return msg.reply('Bot is playing music mate get a life.').catch(console.error);
      }
      const vc = msg.member.voice.channel;
      vc.join()
        .then((connection) => {
          const dispatch = connection.play(file, { volume: vol });
          dispatch.on('finish', () => {
            vc.leave();
          });
        }).catch((err) => {
          console.log(err);
          vc.leave();
        });
    }
    let played = false;
    if (trueGuild) {
      switch (quote) {
        case 'bang average':
        case 'average':
        case 'bang':
          await msg.channel.send('B A N G   A V E R A G E');
          playAudio(this.client, path.join(__dirname, '../../assets/bang.mp3'), 1);
          played = true;
          break;
        case 'this guy':
        case 'oh brother':
        case 'brother':
          await msg.channel.send('https://tenor.com/view/boooooo-this-guy-stinks-serious-spongebob-squarepants-gif-11981386');
          playAudio(this.client, path.join(__dirname, '../../assets/brother.mp3'), 2);
          played = true;
          break;
        case 'nonce':
          await msg.channel.send('*sniff* *sniff* I smell a kiddie fiddler N O N C E');
          played = true;
          break;
        default:
          break;
      }
    }
    switch (quote) {
      case 'awkward':
      case 'silence':
      case 'cricket':
        await msg.channel.send('*cricket intensifies*');
        playAudio(this.client, path.join(__dirname, '../../assets/cricket.mp3'), 0.6);
        break;
      default:
        if (played) return;
        await msg.reply("I don't recognise that quote, try quote <cricket>");
        break;
    }
  }
};
