const request = require('supertest');
const app = require('../src/app');
const Nexus = require('../src/db/models/nexus-model');
const {adminUserFixture ,setUpDatabase} = require('./fixtures/db-fixture');

beforeEach(async()=>{
    await setUpDatabase();
});

test('Should not be able to create Nexus if no authorization', async()=>{
    const newNexus = {
        name: 'myNewNexus',
        maxStations: 4
    };
    await request(app).post('/nexus/create')
    .expect(404)
    .send(newNexus);
});


