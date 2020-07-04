const discord = require('discord.js');

module.exports = class TestClient {
  constructor(options) {
    this.client = new discord.Client();
  }

  login(token) {
    return new Promise((resolve, reject) => {
      if (!token) { throw new Error('Bot token was not supplied'); }
      this.client.login(token).catch(console.error);
      this.client.on('ready', () => resolve(true));
    });
  }

  getResponse(msg, expected) {
    return new Promise((resolve, reject) => {
      this.client.channels.fetch('714485313308852234')
        .then(async (channel) => {
          await channel.send(msg);
          const filter = (m) => m.author.id === '689617552950820867';
          const collected = await channel.awaitMessages(filter, { max: 1, time: 60000 });
          const message = collected.first();
          resolve(message.content.includes(expected) || message.embeds[0] ? message.embeds[0].description.includes(expected) : '');
        })
        .catch(console.error);
    });
  }
};
