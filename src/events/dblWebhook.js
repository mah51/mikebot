module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(something) {
    console.log(something);
  }
};