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
    creator: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

nexusSchema.methods.addStation = async function (stationType){
    try{
        if(this.stations.length >= this.maxStations) return {error: 'Maximum number of stations reached!'};
        const newStation = new Station({stationType, nexus: this._id});
        await newStation.save();
        return newStation;
    }catch(error){
        return {error};
    }
};

//pre hook for nexus deletion to remove stations first
//IMPORTANT!!! use {document:true} option to actually select the document, not the query
nexusSchema.pre('deleteOne', {document: true}, async function(next){
    const nexus = this;
    await Station.deleteMany({nexus: nexus._id});
    next();
});

const Nexus = mongoose.model('Nexus',nexusSchema);
module.exports = Nexus;