const mongoose = require('mongoose');
const mongooseUrl = process.env.MONGO_URL;

mongoose.connect(mongooseUrl,{
        useNewUrlParser:true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(()=>{
        console.log('Connected to nexus-db!');
    }).catch((error)=>{
        console.log(error);
    });