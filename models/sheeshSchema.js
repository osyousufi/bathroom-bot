const mongoose = require('mongoose');

const sheeshSchema = new mongoose.Schema({
    Count: Number
});

module.exports = mongoose.model('sheeshCount', sheeshSchema);
