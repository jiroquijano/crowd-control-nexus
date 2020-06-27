const mongoose = require('mongoose');
const Client = require('./client-model');
const stationTypes = ['order', 'reservation', 'priority'];

/* STATION (agents)
*   Description: stations are nodes 
*   being managed by a nexus. It also serves
*   as the  interface for registering clients.
*   
*   Responsibilities:
*   - register clients (actual people)
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

const deleteClients = async () =>{
    const station = this;
    await Client.deleteMany({station: station._id});
};

stationSchema.pre('deleteMany', {document: true}, async function(next){
    deleteClients();
    next();
});

stationSchema.methods.addClient = async function(clientInfo){
    try{
        const client = new Client({
            ...clientInfo,
            clientNumber: this.clients.length + 1 //todo: generate from nexus
        });
        await client.save();
        return client;
    }catch(error){
        return {error: error.message};
    }
    
};

stationSchema.pre('deleteOne', {document: true}, async function(next){
    deleteClients();
    next();
});

const Station = mongoose.model('Station',stationSchema);
module.exports = Station;