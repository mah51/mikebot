const express = require('express');

class MainRoute {
  constructor(client) {
    this.client = client;
  }

  init() {
    const app = express();
    app.use(express.json({ extended: false }));

    app.post('/', async (req, res) => {
      try {
        if (req.headers && req.headers.authorization && req.headers.authorization.includes(process.env.API_PASSWORD)) {
          this.client.logger.info(`Successful web hook from ${req.body.user}`);
          const user = await this.client.findUser({ id: req.body.user });
          user.votes.value = true;
          user.votes.count += 1;
          user.votes.votes.push({
            date: Date.now(),
            site: 'top.gg',
          });
          user.markModified('votes');
          const foundUser = await this.client.users.fetch(req.body.user);
          if (foundUser) {
            const embed = this.client.embeds.create('success')
              .setTitle('Thank you for voting for MikeBot 😃')
              .setDescription('You will now have access to some cool commands do .help <vote> to get more info.')
              .setAuthor(foundUser.username, foundUser.displayAvatarURL());
            await foundUser.send(embed).catch((err) => {
              if (err.code !== 50007) {
                console.error(err);
              } else {
                this.client.logger.error('Could not send webhook confirmation to user.');
              }
            });
          } else {
            this.client.logger.error('User was not found');
          }

          await user.save();
        } else {
          this.client.logger.error('Unauthorised request to DBL web hook');
          res.status(403).json({ error: 'Unauthorised request' });
        }
      } catch (err) {
        this.client.logger.error(`There was an error in webhook: ${err}`);
      }
    });
    app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));
  }
}
module.exports.MainRoute = MainRoute;
