const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Nexus = require('../../src/db/models/nexus-model');
const User = require('../../src/db/models/user-model');
const Station = require('../../src/db/models/station-model');
const Client = require('../../src/db/models/client-model');

const adminUserId = new mongoose.Types.ObjectId();
const adminUserFixture = {
    _id: adminUserId,
    username: 'admin',
	email:'jiroquijano@nexus.com',
	password: 'Decipher_0731',
    accountType: 'admin',
    token: jwt.sign({_id: adminUserId},process.env.USER_SECRET_KEY)
};

const normalUserId = new mongoose.Types.ObjectId();
const normalUserFixture = {
    _id: normalUserId,
    username: 'normal-user',
	email:'jiro-normal@nexus.com',
	password: 'Decipher_0731',
    accountType: 'normal',
    token: jwt.sign({_id: normalUserId},process.env.USER_SECRET_KEY)
};

const clientFixtureId=  new mongoose.Types.ObjectId();
const clientInformationFixture = {
    _id: clientFixtureId,
    name: 'client',
    mobile: '09989661035',
    status: 'waiting',
    priority: 'normal'
};

const setUpDatabase = async ()=>{
    await Nexus.deleteMany({});
    await User.deleteMany({});
    await Station.deleteMany({});
    await Client.deleteMany({});
    await new User(adminUserFixture).save();
    await new User(normalUserFixture).save();
};

module.exports = {
    setUpDatabase,
    adminUserFixture,
    normalUserFixture,
    clientInformationFixture
}
