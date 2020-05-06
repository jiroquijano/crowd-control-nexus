const mongoose = require('mongoose');
const USER = process.env.USER || 'primo';
const PASS = process.env.PASS || 'nexus-primo';
const mongooseUrl = `mongodb+srv://${USER}:${PASS}@nexus-db-0-bnrup.mongodb.net/nexus-db?retryWrites=true&w=majority`

mongoose.connect(mongooseUrl,{
        useNewUrlParser:true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(()=>{
        console.log('Connected to nexus-db!');
    }).catch((error)=>{
        console.log(error);
    });