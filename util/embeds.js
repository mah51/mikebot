const { MessageEmbed } = require('discord.js');
const format = require('./format');

const colors = {
  general: '#59FF92',
  error: '#FF5251',
  warn: '#FFE423',
  success: '#4BF08C',
};

module.exports = (colortype) => {
  let color = '';
  const embed = new MessageEmbed();
  if (colortype) {
    if (colors[colortype]) color = parseInt(colors[colortype].replace(/#/g, '0x'));
    else throw Error('Invalid color - check the embed construct.');
  } else {
    color = parseInt(colors.general.replace(/#/g, '0x'));
  }
  embed.setColor(color);
  return embed;
};

module.exports.color = (colortype) => parseInt(colors[colortype].replace(/#/g, '0x'));
