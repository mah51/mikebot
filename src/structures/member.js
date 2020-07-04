const mongoose = require('mongoose');

module.exports = mongoose.model('Member', new mongoose.Schema({
  id: String,
  guildID: String,

  // Economy
  balance: { type: Number, default: 0 },
  messageCount: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  steals: {
    type: Object,
    default: {
      stealCount: 0,
      successCount: 0,
      cache: [],
    },
  },
  stolen: {
    type: Object,
    default: {
      stolenCount: 0,
      successCount: 0,
      cache: [],
    },
  },

  cooldowns: {
    type: Object,
    default: {
      work: 0,
      message: 0,
      commands: 0,
      steal: 0,
    },
  },

  reminders: { type: Array, default: [] },
  // Join Sound
  joinSound: {
    type: Object,
    default: {
      url: null,
      timestamp: 0,
    },
  },

  moderation: { type: Array, default: [] },
  mute: {
    type: Object,
    default: {
      muted: false,
      case: null,
      endData: null,
    },
  },

}));
