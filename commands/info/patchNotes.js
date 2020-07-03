const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const moment = require('moment');
const Command = require('../../structures/commands');

module.exports = class PatchNotesCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'patch-notes',
      aliases: ['updates', 'commits', 'patch'],
      group: 'info',
      memberName: 'patch-notes',
      description: 'Responds with the bot\'s latest 10 releases.',
      guarded: true,
    });
  }

  async run(msg, args, fromPattern, something) {
    const { data } = await axios.get('https://api.github.com/repos/mah51/mikebot/commits', {
      responseType: 'json',
      username: process.env.GITHUB_USER,
      password: process.env.GITHUB_PASS,
    });
    const body = data;
    if (!body) { return msg.reply('There was an error connecting to github.').catch(console.error); }
    const commits = body.slice(0, 8);
    const embed = new MessageEmbed()
      .setTitle('Last 8 patches:')
      .setColor(this.client.setting.colour);
    commits.forEach((commit) => {
      embed.addField(`${moment(commit.commit.committer.date).format('DD/MM/YY - HH.mm.ss')} made by ${commit.commit.author.name}`, commit.commit.message);
    });
    return msg.embed(embed);
  }
};
