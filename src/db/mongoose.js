const mongoose = require('mongoose');
const mongooseUrl = process.env.MONGO_URL.replace('$USER$',process.env.MONGO_USER).replace('$PASS$',process.env.MONGO_PASS);

mongoose.connect(mongooseUrl,{
        useNewUrlParser:true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(()=>{
        console.log('Connected to nexus-db!');
    }).catch((error)=>{
        console.log(error);
    });