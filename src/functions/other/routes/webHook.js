module.exports = async (req, res, client) => {
  try {
    if (req.headers && req.headers.authorization && req.headers.authorization.includes(process.env.API_PASSWORD)) {
      client.logger.info(`Successful web hook from ${req.body.user}`);
      const user = await client.findUser({ id: req.body.user });
      user.votes.value = true;
      user.votes.count += 1;
      user.votes.votes.push({
        date: Date.now(),
        site: 'top.gg',
        claimed: false,
      });
      user.markModified('votes');
      const foundUser = await client.users.fetch(req.body.user);
      if (foundUser) {
        const embed = client.embeds.create('general')
          .setTitle('Thank you for voting for MikeBot 😃')
          .setDescription('You will now have access to some cool commands do .help <vote> to get more info.')
          .addField('Balance', 'You can claim 300 points of balance in any server on the right with the `.get-balance` command.', true)
          .addField('\u200b', '\u200b', true)
          .addField('Vote count', `You have voted ${user.votes.count} times`, true)
          .addField('\u200b', '\u200b', true)
          .addField('Flex command', 'I gave you access to the `.flex` command for 12 hours, now go flex on some peasants.', true)
          .setAuthor(foundUser.username, foundUser.displayAvatarURL());
        await foundUser.send(embed).catch((err) => {
          if (err.code !== 50007) {
            console.error(err);
          } else {
            client.logger.error('Could not send webhook confirmation to user.');
          }
        });
      } else {
        client.logger.error('User was not found');
      }

      await user.save();
    } else {
      client.logger.error('Unauthorised request to DBL web hook');
      res.status(403).json({ error: 'Unauthorised request' });
    }
  } catch (err) {
    client.logger.error(`There was an error in webhook: ${err}`);
  }
};
