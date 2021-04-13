const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userID: {
    type: String,
    require: true,
    unique: true
  },
  rupees: {
    type: Number,
    default: 1000
  },
  bank: {
    type: Number
  }
});

module.exports = mongoose.model('profiles', profileSchema);
