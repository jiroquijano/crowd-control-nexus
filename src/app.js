const express = require('express');
const nexusRouter = require('./routers/nexus-router');
const stationRouter = require('./routers/station-router');
const userRouter = require('./routers/user-router');
const clientRouter = require('./routers/client-router');
require('./db/mongoose');
const app = express();

app.use(express.json());
app.use(nexusRouter);
app.use(stationRouter);
app.use(userRouter);
app.use(clientRouter);

module.exports = app;