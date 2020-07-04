module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(guild) {
    const memberOwner = guild.owner ? guild.owner : await guild.members.fetch(guild.ownerID);
    this.client.logger.silly(`Unlucky pal, you got kicked from ${guild.name} with ${guild.memberCount} members, owned by ${memberOwner.user.username}`);
    const guildData = await this.client.guildsData.findOne({ id: guild.id }).populate('members');
    for (const member of guildData.members) {
      // eslint-disable-next-line no-await-in-loop
      await this.client.membersData.deleteOne(member).catch(console.error);
    }
    guildData.remove().catch(console.error);
  }
};
