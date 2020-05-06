const express = require('express');
require('./db/mongoose');
const PORT  = process.env.PORT || 3000;
const app = express();

app.listen(PORT,()=>{
    console.log(`listening on port: ${PORT}`);
})