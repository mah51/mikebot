const unmuteCheck = require('./unmute');
const reminderCheck = require('./reminder');
const voiceCheck = require('./voiceCheck');

module.exports = (client) => {
  setInterval(async () => {
    await unmuteCheck(client);
    await reminderCheck(client);
    await voiceCheck(client);
  }, 10000);
};
