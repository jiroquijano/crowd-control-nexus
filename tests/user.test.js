const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../src/app');
const User = require('../src/db/models/user-model');
const Nexus = require('../src/db/models/nexus-model');
const {setUpDatabase, normalUserFixture} = require('./fixtures/db-fixture');
const {createUser, logInUser} = require('./helpers/user-helpers');

beforeEach(async ()=>{
    await setUpDatabase();
});

test('Should not be able to edit accounts without authentication', async()=>{
    await request(app).get('/users/me').expect(401);
    await request(app).patch('/users/update').expect(401);
});

test('Should be able to create new user', async ()=>{
    const newUser = {
        username: 'jiro',
        email: 'newuser@newuser.com',
        password: 'Thisismypassword123'
    };
    const response = await createUser(newUser);
    const user = await User.findById(response.body.user._id);
    expect({
        username: user.username,
        email: user.email
    }).toMatchObject({
        username: 'jiro',
        email: 'newuser@newuser.com'
    });
});

test('Users should be able to log in', async()=>{
    const credentials = {
            email: normalUserFixture.email,
            password: normalUserFixture.password
    };
    const response = await logInUser(credentials);
    const loggedInUser = await User.findById(response.body.user._id);
    expect({
        username: loggedInUser.username,
        email: loggedInUser.email
    }).toMatchObject({
        username: normalUserFixture.username,
        email: normalUserFixture.email
    });
});

test('User password should be hashed', async()=>{
    const newUser = {
        username: 'jiro-kun',
        email: 'jiroemail@email.com',
        password: 'StrongPassword123'
    }
    const response = await createUser(newUser);
    const user = await User.findById(response.body.user._id);
    expect(user.password).not.toBe(newUser.password);
    expect(await bcrypt.compare(newUser.password,user.password)).toBe(true);
});

