const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userID: {
    type: String,
    require: true,
    unique: true
  },
  wallet: {
    type: Number,
    default: 1000
  },
  bank: {
    type: Number
  },
  inventory: {
    type: Array
  },
  bjStats: {
    type: Map,
    of: Number
  },
  rlStats: {
    type: Map,
    of: Number
  },
}, {strict: false});

module.exports = mongoose.model('profiles', profileSchema);
