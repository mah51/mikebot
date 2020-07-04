const mongoose = require('mongoose');

module.exports = mongoose.model('Error', new mongoose.Schema({
  userID: { type: String },
  guildID: { type: String },
  commandName: { type: String },
  error: { default: {}, type: Object },
  code: { type: String },
}));
