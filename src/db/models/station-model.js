const mongoose = require('mongoose');
const stationTypes = ['service', 'order', 'seats'];

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
        ref: 'Nexus',
        required: true
    },
    clients:[{
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client'
        }
    }],
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Station = mongoose.model('Station',stationSchema);
module.exports = Station;