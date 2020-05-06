const mongoose = require('mongoose');
const Station = require('./station-model');

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
    }],
    owner: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

nexusSchema.methods.addStation = async function (stationType){
    try{
        if(this.stations.length >= this.maxStations) return {error: 'Maximum number of stations reached!'};
        const newStation = new Station({stationType, nexus: this._id});
        this.stations.push(newStation._id);
        await this.save();
        await newStation.save();
    }catch(error){
        return {error};
    }
}

const Nexus = mongoose.model('Nexus',nexusSchema);
module.exports = Nexus;