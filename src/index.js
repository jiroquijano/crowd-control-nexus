const express = require('express');
require('./db/mongoose');
const nexusRouter = require('./routers/nexus-router');
const stationRouter = require('./routers/station-router');
const PORT  = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(nexusRouter);
app.use(stationRouter);

app.listen(PORT,()=>{
    console.log(`listening on port: ${PORT}`);
})