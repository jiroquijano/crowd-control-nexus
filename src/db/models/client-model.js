const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    mobile:{
        type: String,
        validate(mobileNumber){
            if(mobileNumber !== 'n/a' && mobileNumber.length !== 11) throw new Error('Please double check phone number');
        },
        default: 'n/a'
    },
    clientNumber: {
        type: String,
        unique: true
    },
    status:{
        type: String,
        default: 'waiting'
    },
    priority:{
        type: String,
        default: 'normal'
    },
    station_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Station'
    }
});

const Client = mongoose.model('Client',clientSchema);
module.exports = Client;