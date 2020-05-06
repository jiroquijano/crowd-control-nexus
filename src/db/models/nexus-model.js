const mongoose = require('mongoose');

const nexusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    maxStations: {
        type: Number,
        default: 1
    },
    stations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station'
    }]
});

const Nexus = mongoose.Model('Nexus',nexusSchema);
module.exports = Nexus;