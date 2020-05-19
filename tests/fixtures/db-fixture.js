const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Nexus = require('../../src/db/models/nexus-model');
const User = require('../../src/db/models/user-model');
const Station = require('../../src/db/models/station-model');
const Client = require('../../src/db/models/client-model');

const adminUserId = new mongoose.Types.ObjectId();
const adminUserFixture = new User({
    _id: adminUserId,
    username: 'jiro-admin',
	email:'jiroquijano@gmail.com',
	password: 'Decipher_0731',
    accountType: 'admin',
    token: jwt.sign({_id: adminUserId},process.env.USER_SECRET_KEY)
});

const setUpDatabase = async ()=>{
    await Nexus.deleteMany({});
    await User.deleteMany({});
    await Station.deleteMany({});
    await Client.deleteMany({});
    await adminUserFixture.save();
};

module.exports = {
    setUpDatabase,
    adminUserFixture
}
