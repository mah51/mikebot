const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');
const Command = require('../../structures/commands');
const { API } = require('../../config.json');

module.exports = class updateDocs extends Command {
  constructor(client) {
    super(client, {
      name: 'update-docs',
      aliases: [
        '',
      ],
      group: 'owner-only',
      memberName: 'update-docs',
      description: '',
      details: '',
      examples: [],
      args: [],
      guildOnly: true,
      ownerOnly: true,
      hidden: true,
    });
  }

  async run(msg, args, fromPattern, something) {
    if (!process.env.IN_PRODUCTION) { return msg.reply('The bot isn\'t in production so that command cant be run.').catch(console.error); }
    const filePath = path.join(__dirname, '../../mikebot-docs/docs/commands/');
    const repo = 'mikebot-docs';
    const userName = API.github.user;
    const { password } = API.github;
    const gitHubUrl = `https://${userName}:${password}@github.com/${userName}/${repo}`;
    fs.readdir(filePath, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(filePath, file), (err) => {
          if (err) throw err;
          console.log(`unlink on ${file}`);
        });
      }
    });
    setTimeout(() => {
      fs.writeFile(`${filePath}README.md`, `
# Introduction

MikeBot is a fun bot to enhance your discord server. The bot is constantly under-development to make it the best it can be. This does mean bugs might be present so the owner would appriciate it if you found one to use the \`.bug\` command to inform him about it. 
`, (err) => {
        if (err) throw err;
        console.log('Read me updated!');
      });

      for (const group of this.client.registry.groups.array()) {
        let data = `# ${group.name}

${group.description}
---

---`;
        const commandios = group.commands.array().filter((command) => !command.ownerOnly || !command.hidden);
        if (commandios.length > 0) {
          data += commandios.map((command) => (`
### ${command.nameLong || command.name}

**Use:** \`.${command.name}\`<br/>
${command.examples ? `**Usage:** \`.${command.examples[0]}\`<br/>` : ''}
**Bot permissions:** ${command.clientPermissions ? command.clientPermissions.map((perm) => perm[0] + perm.slice(1).toLowerCase()).join(', ') : 'None'}<br/>
**User permissions:** ${command.userPermissions ? command.userPermissions.map((perm) => perm[0] + perm.slice(1).toLowerCase()).join(', ') : 'None'}${command.userRoles ? ` (or a role: ${command.userRoles.map((perm) => perm[0].toUpperCase() + perm.slice(1).toLowerCase()).join(', ')})` : ''}<br/>
**Description:** ${command.details || command.description}<br/>
`)).join('\n');
          // eslint-disable-next-line no-await-in-loop
          fs.writeFile(`${filePath + group.id}.md`, data, (err) => {
            if (err) throw err;
            console.log(`${group.name} docs written`);
          });
        } else {
          console.log(`No commands in ${group.name}`);
        }
      }
      return msg.say('Did the thing').catch(console.error);
    }, 1000);
  }
};
