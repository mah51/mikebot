const ytdl = require('ytdl-core');
const Command = require('../../structures/commands');
const { youtubeParser } = require('../../functions/musicFunctions');

module.exports = class SaveLink extends Command {
  constructor(client) {
    super(client, {
      name: 'fchange-link',
      aliases: ['fclink', 'forcechangelink'],
      group: 'join-sound',
      memberName: 'forcechangelink',
      description: 'Overwrites a current user\'s saved link need manage channel permissions to use.',
      guildOnly: true,
      examples: [
        'fchange-link @Mikerophone https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      ],
      userPermissions: ['ADMINISTRATOR'],
      userRoles: ['admin'],
      args: [{
        key: 'member',
        prompt: 'Who\'s link would you like to change?',
        type: 'member',

      },
      {
        key: 'link',
        prompt: 'What is the link?',
        type: 'string',
      },
      ],
    });
  }

  async run(msg, { member, link }, fromPattern, something) {
    const linkInfo = await ytdl.getBasicInfo(link);
    const memberInfo = await this.client.findMember({ id: member.id, guildID: msg.guild.id });
    if (!memberInfo.joinSound.url) return this.makeError(msg, 'This user has not yet setup a link, and cannot be changed!').catch(console.error);
    if (linkInfo.length_seconds > 7) return this.makeError(msg, "Audio sample too long, that's going to annoy too many people!").catch(console.error);
    const videoID = await youtubeParser(link);
    if (!videoID) { return this.makeError('That is an invalid youtube link.').catch(console.error); }
    memberInfo.joinSound.url = videoID;
    memberInfo.markModified('joinSound');
    await memberInfo.save();
    return msg.say('Link updated! Remember I can only join voice channels I have permissions for!').catch(console.error);
  }
};
