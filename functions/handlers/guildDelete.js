module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(guild) {
    this.client.logger.silly(`Unlucky pal, you got kicked from ${guild.name} with ${guild.memberCount} members, owned by ${guild.owner.user.username}`);
    const guildData = await this.client.guildsData.findOne({ id: guild.id }).populate('members');
    for (const member of guildData.members) {
      await this.client.membersData.deleteOne(member).catch(console.error);
    }
    guildData.remove().catch(console.error);
  }
};
