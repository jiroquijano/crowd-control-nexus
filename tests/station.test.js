const request = require('supertest');
const app = require('../src/app');
const {setUpDatabase, clientInformationFixture, normalUserFixture} = require('./fixtures/db-fixture');
const {createNexus, createStationUnderNexus} = require('./helpers/nexus-helpers');

beforeEach(async()=>{
    await setUpDatabase();
});

test("should not be able to access station routes with no authorization", async ()=>{
    await request(app).get('/station/1').expect(401);
});

test("should be able to fetch own station by id", async()=>{
    const nexus = await createNexus({name:'myNewNexus'},normalUserFixture.token);
    const station = await createStationUnderNexus(nexus.body._id,'order', normalUserFixture.token);
    await request(app).get(`/station/${station.body._id}`)
                .set('Authorization', `Bearer ${normalUserFixture.token}`)
                .expect(200)
                .send();
});

test("should be able to add client under station", async()=>{
    const nexus = await createNexus({name:'myNewNexus'}, normalUserFixture.token);
    const station = await createStationUnderNexus(nexus.body._id, 'order',normalUserFixture.token);
    
    const newClient = {
        name: 'jiro',
        priority: 'high',
        station_id: station.body._id
    };

    await request(app).post(`/station/addclient`)
                .set('Authorization', `Bearer ${normalUserFixture.token}`)
                .expect(201)
                .send(newClient);    
});