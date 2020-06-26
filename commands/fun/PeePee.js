const discord = require('discord.js');
const Command = require('../../structures/commands');

module.exports = class PeePee extends Command {
  constructor(client) {
    super(client, {
      name: 'pp',
      aliases: ['peepee', 'penislength'],
      group: 'fun',
      memberName: 'pp',
      description: 'Tells the user the length of their pp',
      args: [
        {
          key: 'member',
          label: 'member',
          prompt: 'Provide the user\'s name.',
          type: 'member',
          default: '',
          error: 'I could not find that user just user their tag eg. @Mikerophone',
        },
      ],
    });
  }

  async run(msg, { member }, fromPattern, something) {
    let field;
    let title;
    let user = member;
    if (!member) {
      user = msg.member;
    }
    if (Math.floor(Math.random() * 75) === 50) {
      field = '8========================================================';
      title = `${user.displayName} HLOY SHIT YOU BROKE THE SCALE WTF IS HaPPENIGN`;
    } else if (Math.floor(Math.random() * 75) === 50) {
      field = '8D';
      title = `${user.displayName} has a C H O D E`;
    } else {
      const length = Math.round((Math.random() * 11) + 1);
      const equals = '=';
      field = `8${equals.repeat(length)}D`;
      title = `${user.displayName}'s pp length is: ${length} inches`;
    }
    const embed = new discord.MessageEmbed()
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setFooter(this.client.setting.footer)
      .setTimestamp()
      .setDescription(field)
      .setTitle(title);
    return msg.channel.send({ embed }).catch(console.error);
  }
};
