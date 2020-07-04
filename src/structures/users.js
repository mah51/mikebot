const mongoose = require('mongoose');

module.exports = mongoose.model('User', new mongoose.Schema({
  id: String,
  votes: {
    type: Object,
    default: {
      cooldown: 0,
      count: 0,
      votes: [],
    },
  },
}));
