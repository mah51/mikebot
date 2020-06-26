const got = require('got');

module.exports = async (link) => {
  let response;
  try {
    response = await got(link, { responseType: 'json' });
  } catch (err) {
    return err.response.body;
  }
  return response.body;
};
