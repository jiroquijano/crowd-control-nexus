const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const stationTypes = ['service, order, seats'];
const SECRET_KEY = process.env.CCS_SECRET || 'defaultsecretkey';

/* STATION (agents)
*   Description: stations are nodes 
*   being managed by a nexus. It also serves
*   as the  interface for registering clients.
*   
*   Responsibilities:
*   - register to a nexus
*   - register clients (actual people)
*   - displays next in queue
*/
const stationSchema = new mongoose.Schema({
    stationType:{
        type: String,
        required: true,
        validate(type) {
            if(!stationTypes.includes(type)){
                throw new Error('Station Type is invalid!');
            }
        }
    },
    nexus:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nexus'
    },
    token:{
        type: String,
        required: true
    },
    clients:[{
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client'
        }
    }]
});

//Station model method for generating JWT authorization tokens
stationSchema.methods.generateToken = async function(){
    const station = this;
    const token = await jwt.sign({_id: station.id.toString()}, SECRET_KEY);
    if(token) station.token = token;
    await station.save();
    return token;
}

const Station = mongoose.model('Station',stationSchema);
module.exports = Station;