module.exports = (client) => {
  client.guilds.cache.forEach((guild) => {
    if (!guild.me.voice) { return; }
    const { channel } = guild.me.voice;
    if (!channel) return;
    if (channel.members.size > 1) return;
    const musicGuild = client.music.guilds.get(guild.id);
    if (musicGuild) {
      client.music.guilds.delete(guild.id);
    }
    client.voice.connections.forEach((conn) => {
      if (conn.channel.guild.id === guild.id) conn.disconnect();
    });
  });
};
