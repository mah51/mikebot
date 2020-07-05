const unmuteCheck = require('./unmute');
const reminderCheck = require('./reminder');
const voiceCheck = require('./voiceCheck');

module.exports = (client) => {
  setInterval(async () => {
    if (process.env.DEBUG === 'on') console.log('Doing checks');
    await unmuteCheck(client);
    await reminderCheck(client);
    await voiceCheck(client);
  }, 20000);
};
