const express = require('express');
const nexusRouter = require('./routers/nexus-router');
const stationRouter = require('./routers/station-router');
const userRouter = require('./routers/user-router');
require('./db/mongoose');
const app = express();

app.use(nexusRouter);
app.use(stationRouter);
app.use(userRouter);
app.use(express.json());

module.exports = app;