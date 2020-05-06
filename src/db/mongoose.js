const mongoose = require('mongoose');
const mongooseUrl = 'mongodb+srv://primo:nexus-primo@nexus-db-0-bnrup.mongodb.net/nexus-db?retryWrites=true&w=majority'

mongoose.connect(mongooseUrl,{
        useNewUrlParser:true,
        useUnifiedTopology: true
    }).then(()=>{
        console.log('Connected to nexus-db!');
    }).catch((error)=>{
        console.log(error);
    });