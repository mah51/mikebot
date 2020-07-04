const Canvas = require('canvas');
const Discord = require('discord.js');
const wrap = require('node-wordwrap')(18);
const path = require('path');

Canvas.registerFont(path.join(__dirname, '../../assets/fonts/Otto.ttf'), { family: 'FancyFont' });

async function pooh(msg, canvasSize, imagePath, pos1, pos2, textSize, heightMultiplier) {
  const filter = (m) => m.author.id === msg.author.id;
  msg.reply('What would you like the top text to be?').catch(console.error);
  const topTextMessage = await msg.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] });
  const topText = topTextMessage.first().content;

  msg.reply('What would you like the bottom text to be?').catch(console.error);
  const bottomTextMessage = await msg.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] });
  const bottomText = bottomTextMessage.first().content;

  if (topText.length > 54 || bottomText.length > 54) { return msg.reply('Top text and bottom text have to be under 54 characters long').catch(console.error); }
  const pos1y = pos1[1] - topText.length * heightMultiplier;
  const pos2y = pos2[1] - bottomText.length * heightMultiplier * 1.5;
  const canvas = Canvas.createCanvas(canvasSize[0], canvasSize[1]);
  const ctx = canvas.getContext('2d');
  const background = await Canvas.loadImage(imagePath);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#000000';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Select the font size and type from one of the natively available fonts
  ctx.font = `${textSize}px sans-serif`;
  // Select the style that will be used to fill the text in
  ctx.fillStyle = '#000000';
  // Actually fill the text with a solid color
  ctx.fillText(wrap(topText), pos2y, pos1y);
  ctx.font = `${textSize + 45}px FancyFont`;
  ctx.fillText(wrap(bottomText), pos2[0], pos2[1]);

  const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'meme-image.png');
  const messages = msg.channel.messages.cache
    .filter((message) => [msg.author.id, msg.client.user.id].includes(message.author.id));
  messages.last(4).forEach((message) => {
    message.delete();
  });
  return msg.channel.send(`Here's your meme, ${msg.member}!`, attachment).catch(console.error);
}
async function spongeBob(msg) {
  const filter = (m) => m.author.id === msg.author.id;
  msg.reply('What would you like the text to be?').catch(console.error);
  const topTextMessage = await msg.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] });
  const topText = topTextMessage.first().content;
  const canvas = Canvas.createCanvas(1920, 1080);
  const ctx = canvas.getContext('2d');
  const background = await Canvas.loadImage(path.join(__dirname, '../../assets/images/meme-templates/mocking-spongebob.jpg'));
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#000000';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Select the font size and type from one of the natively available fonts
  ctx.font = '250px sans-serif';
  // Select the style that will be used to fill the text in
  ctx.fillStyle = '#ffffff';
  // Actually fill the text with a solid color
  const x = 50;
  const y = 950;
  ctx.lineJoin = 'miter';
  ctx.miterLimit = 2;

  ctx.strokeText(topText, x, y);
  ctx.fillText(topText, x, y);

  const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'meme-image.png');
  const messages = msg.channel.messages.cache
    .filter((message) => [msg.author.id, msg.client.user.id].includes(message.author.id));
  messages.last(2).forEach((message) => {
    message.delete();
  });
  return msg.channel.send(`Here's your meme, ${msg.member}!`, attachment).catch(console.error);
}
module.exports = { pooh, spongeBob };
