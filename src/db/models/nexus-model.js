const mongoose = require('mongoose');

/* NEXUS (central)
**  Description: a nexus is a model which manages
**  registered stations which belongs to its topology
**  
**  Responsibilities:
**  -register stations
**  -authenticate station transactions
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

const Nexus = mongoose.Model('Nexus',nexusSchema);
module.exports = Nexus;