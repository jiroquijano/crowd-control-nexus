const mongoose = require('mongoose');

/* NEXUS (central)
**  Description: a nexus is a model which manages
**  registered stations which belongs to its topology
**  
**  Responsibilities:
**  -register stations
**  -manage stations
*/
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

const Nexus = mongoose.model('Nexus',nexusSchema);
module.exports = Nexus;