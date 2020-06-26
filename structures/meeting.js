class Meeting {
  constructor(time, people, guild) {
    this.time = time;
    this.people = people;
    this.guild = guild;
  }

  getTime() {
    return this.time;
  }

  getPeople() {
    return this.people;
  }

  getGuild() {
    return this.guild;
  }
}

module.exports = Meeting;
