const express = require('express');

class MainRoute {
  constructor(client) {
    this.client = client;
  }

  init() {
    const app = express();
    app.use(express.json({ extended: false }));
    async function processSomething(callback) {
      console.log('Webhook Successful!');
      setTimeout((callback), 2000);
    }
    app.post('/api/', async (req, res) => {
      await processSomething(() => {
        console.log('update');
      });

      res.status(200).send('OK');
    });
    app.listen(8000, () => console.log(`Listening on port ${8000}`));
  }
}
const route = new MainRoute();
route.init();
module.exports = MainRoute;
