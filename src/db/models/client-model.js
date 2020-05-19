const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    mobile:{
        type: Number,
        validate(number){
            if(number.length != 11) throw new Error('Please double check phone number');
        }
    },
    clientNumber: {
        type: Number,
        unique: true
    },
    status:{
        type: String,
        default: 'waiting'
    },
    priority:{
        type: String,
        default: 'normal'
    }
});

const Client = mongoose.model('Client',clientSchema);
module.exports = Client;