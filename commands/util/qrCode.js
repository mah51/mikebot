const { oneLine } = require('common-tags');
const Command = require('../../structures/commands');

module.exports = class QRCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'qr',
      aliases: ['qrcode', 'createqr'],
      group: 'util',
      memberName: 'qr',
      description: 'Generate a QR code to share links/text easily. Any text after the qr command will be encoded in the QR code. \n For multi-coloured QR codes, use the qr+ command instead.',
      details: oneLine`
Generate a QR code to share links/text easily. Any text after the qr command will be encoded in the QR code. \n For multi-coloured QR codes, use the qr+ command instead.
`,
      examples: ['qr Hey there!'],
    });
  }

  async run(msg, args, fromPattern, something) {
    if (args.length < 2) { return msg.reply('Add text that you want the qr to store!').catch(console.error); }
    const userText = args.split(' ').join('%20');
    const qrGenerator = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${userText}`;
    return msg.reply(qrGenerator).catch(console.error);
  }
};
