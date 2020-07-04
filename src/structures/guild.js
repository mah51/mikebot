const mongoose = require('mongoose');

module.exports = mongoose.model('Guild', new mongoose.Schema({
  id: { type: String },
  membersData: { type: Object, default: {} }, // Members data of the guild
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],

  plugins: {
    type: Object,
    default: { // Plugins data
      // Welcome messages
      welcome: {
        enabled: false, // Whether the welcome messages are enabled
        message: null, // The welcome message
        channel: null, // The channel to send the welcome messages
        withImage: null, // Whether the welcome images are enabled
      },
      // Goodbye messages
      goodbye: {
        enabled: false, // Whether the goodbye messages are enabled
        message: null, // The goodbye message
        channel: null, // The channel to send the goodbye messages
        withImage: null, // Whether the goodbye images are enabled
      },
      music: {
        volume: 50,
      },
      // Autorole
      autorole: {
        enabled: false, // Whether the autorole is enabled
        role: null, // The role to add when a member join the server
      },
      // Auto moderation
      automod: {
        enabled: false, // Whether the auto moderation is enabled
        ignored: [], // The channels in which the auto moderation is disabled
      },
      // Auto sanctions
      warnsSanctions: {
        kick: false, // The number of warns required to kick the user
        ban: false, // The number of warns required to ban the user
      },
      // Tickets
      tickets: {
        enabled: false, // Whether the tickets system is enabled
        category: null, // The category for the tickets system
      },
    },
  },

  logs: false,

  slowMode: {
    type: Object,
    default: {
      users: [],
      channels: [],
    },
  },
  caseNumber: { type: Number, default: 0 },
  customCommands: { type: Object, default: 0 },
}));
