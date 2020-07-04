const ytdl = require('ytdl-core');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(oldState, newState) {
    const { client } = newState.guild;
    if (oldState.channel !== newState.channel && newState.channel !== null) {
      const queue = newState.client.music.guilds.get(newState.guild.id);
      if (queue && queue.audioDispatcher) {
        return;
      }
      if (client.registry.groups.get('join-sound').isEnabledIn(newState.guild.id)) {
        const temp = await this.client.findMember({ id: newState.member.id, guildID: newState.guild.id }, true);
        const result = temp.joinSound;
        if (!result.url) {
          return;
        }
        const vc = newState.channel;
        if (!vc.permissionsFor(newState.guild.me).has(['CONNECT', 'SPEAK'])) { return; }
        vc.join()
          .then((connection) => {
            const dispatch = connection.play(ytdl(result.url), { volume: 0.5 });
            setTimeout(() => {
              dispatch.end();
            }, 6000);
            dispatch.on('finish', () => {
              vc.leave();
            });
          }).catch((err) => {
            console.log(err);
            vc.leave();
          });
      }
    }
  }
};
