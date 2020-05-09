const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name:{
        Type: String,
        required: true,
        trim: true
    },
    mobile:{
        Type: Number,
        validate(number){
            if(number.length != 11) throw new Error('Please double check phone number');
        }
    },
    clientNumber: {
        type: Number,
        unique: true
    },
    status:{
        Type: String,
        default: 'waiting'
    },
    priority:{
        Type: String,
        default: 'normal'
    }
});

const Client = mongoose.model('Client',clientSchema);
module.exports = Client;