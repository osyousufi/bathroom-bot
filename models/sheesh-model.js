const mongoose = require('mongoose');

const SheeshSchema = new mongoose.Schema({
    Count: Number
});

module.exports = mongoose.model('sheeshCount', SheeshSchema);
