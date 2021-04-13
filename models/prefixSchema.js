const mongoose = require('mongoose');

const prefixSchema = new mongoose.Schema({
    Prefix: {
        type: String
    },
    GuildID: String
});

module.exports = mongoose.model('prefixes', prefixSchema);
