const dictionary = require('../../assets/badWords');

module.exports = function filter(string) {
  const str = string || '';
  const regexp = new RegExp(dictionary.join('|'));
  return regexp.test(str);
};
