const request = require('supertest');
const app = require('../src/app');
const {setUpDatabase, clientInformationFixture} = require('./fixtures/db-fixture');
const Client = require('../src/db/models/client-model');

beforeEach(async ()=>{
    await setUpDatabase();
});

test("Should be able to get client info by id", async ()=>{
    const client = new Client(clientInformationFixture);
    await client.save();
    await request(app).get(`/client/${clientInformationFixture._id}`).expect(200);
});