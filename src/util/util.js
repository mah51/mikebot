const yes = ['yes', 'y', 'ye', 'yeah', 'yup', 'yea', 'ya', 'geezer', 'si', 'sí', 'oui', 'indeed', 'correct', 'gorn', 'sure'];
const no = ['no', 'n', 'nah', 'nope', 'nop', 'nine', 'non', 'no chance', 'piss', 'fuck'];
const inviteRegex = /(https?:\/\/)?(www\.|canary\.|ptb\.)?discord(\.gg|(app)?\.com\/invite|\.me)\/([^ ]+)\/?/gi;
const botInvRegex = /(https?:\/\/)?(www\.|canary\.|ptb\.)?discord(app)?\.com\/(api\/)?oauth2\/authorize\?([^ ]+)\/?/gi;

module.exports = {
  stripInvites: (str, { guild = true, bot = true, text = '[Invite removed]' } = {}) => {
    let string = str;
    if (guild) string = str.replace(inviteRegex, text);
    if (bot) string = str.replace(botInvRegex, text);
    return string;
  },

  shorten: (text, maxLen = 2000) => (text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text),

  shuffle: (array) => {
    const arr = array.slice(0);
    for (let i = arr.length - 1; i >= 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  },

  verify: async (channel, user, { time = 30000, extraYes = [], extraNo = [] } = {}) => {
    const filter = (res) => {
      const value = res.content.toLowerCase();
      return (user ? res.author.id === user.id : true)
        && (yes.includes(value) || no.includes(value) || extraYes.includes(value) || extraNo.includes(value));
    };
    const ver = await channel.awaitMessages(filter, {
      max: 1,
      time,
    });
    if (!ver.size) return 0;
    const choice = ver.first().content.toLowerCase();
    if (yes.includes(choice) || extraYes.includes(choice)) return true;
    if (no.includes(choice) || extraNo.includes(choice)) return false;
    return false;
  },

  youtubeParser: (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
  },

  queryFormatter: (query) => {
    let queryString = '';
    const queryA = query.split(/\s+/);
    for (let i = 0; i < queryA.length; i += 1) {
      queryString += `${queryA[i]}%20`;
    }
    return queryString;
  },
};
