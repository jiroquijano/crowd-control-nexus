const mongoose = require('mongoose');
const stationTypes = ['service, order, seats'];


/* STATION (agents)
*   Description: stations are nodes 
*   being managed by a nexus. It also serves
*   as the  interface for registering users.
*   
*   Responsibilities:
*   - register to a nexus
*   - register users (actual people)
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
    users:[{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }]
});

const Station = mongoose.model('Station',stationSchema);
module.exports = Station;