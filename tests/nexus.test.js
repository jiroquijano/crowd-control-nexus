const request = require('supertest');
const app = require('../src/app');
const Nexus = require('../src/db/models/nexus-model');
const User = require('../src/db/models/user-model');
const Station = require('../src/db/models/station-model');
const {adminUserFixture, normalUserFixture ,setUpDatabase} = require('./fixtures/db-fixture');

const createNexus = async (newNexus, userToken) =>{
    return await request(app).post('/nexus/create')
    .set('Authorization', `Bearer ${userToken}`)
    .send(newNexus)
    .expect(201);
};

const getNexusById = async(nexusId, userToken)=>{
    return await request(app).get(`/nexus/${nexusId}`)
    .set('Authorization', `Bearer ${userToken}`)
    .send().expect(200);
};

const deleteNexus = async(nexusId, userToken)=>{
    return await request(app).delete(`/nexus/${nexusId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200)
            .send();
};

const createStationUnderNexus = async (nexusId, stationType, userToken) =>{
    return await request(app).post('/nexus/addStation')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(201)
                .send({
                    nexusId,
                    stationType
                });
};

const deleteStationUnderNexus = async(nexusId, stationId, userToken) =>{
    return request(app).delete('/nexus/deleteStation')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .send({
            nexusId,
            stationId
        });
};


beforeEach(async()=>{
    await setUpDatabase();
});

afterEach(async()=>{
    await User.deleteMany({});
});

test('User Should not be able to access routes with no authorization', async()=>{
    await request(app).get('/nexus/all').expect(401);
    await request(app).get('/nexus/somerandomid').expect(401);
    await request(app).post('/nexus/create').expect(401);
    await request(app).post('/nexus/addstation').expect(401);
    await request(app).delete('/nexus/deleteStation').expect(401);
    await request(app).delete('/nexus/somerandomid').expect(401);
});

test('Should be able to create Nexus for authorized user', async()=>{
    const response = await createNexus({name:'myNewNexus'}, normalUserFixture.token);
    const nexus = await Nexus.findById(response.body._id);
    expect(nexus).not.toBeNull();
    expect(response.body.creator).toBe(normalUserFixture._id.toString());
});

test('Normal users should be able to get information about Nexus they created', async()=>{
    const response = await createNexus({name:'newNexus'},normalUserFixture.token);
    const nexus = await Nexus.findById(response.body._id);
    const getNexusResponse = await getNexusById(nexus._id, normalUserFixture.token);
    expect(getNexusResponse.body._id).toBe(nexus._id.toString());
});

test('Admin can get information about Nexus of other users', async()=>{
    const response = await createNexus({name:'ownedbysomeuser'}, normalUserFixture.token);
    const normalUserNexus = await Nexus.findById(response.body._id);
    const responseUsingAdmin = await getNexusById(normalUserNexus._id,adminUserFixture.token);
    expect(responseUsingAdmin.body._id).not.toBeNull();
    expect(responseUsingAdmin.body.creator).not.toBe(adminUserFixture._id.toString());
});

test('Users should not be able to access other user\'s Nexus', async()=>{
    const response = await createNexus({name:"admin-nexus"},adminUserFixture.token);
    await request(app).get(`/nexus/${response.body._id}`)
                    .set('Authorization', `Bearer ${normalUserFixture.token}`)
                    .expect(404)
                    .send();
});

test('Admin should be able to get all Nexus information in DB', async()=>{
    await createNexus({name:'normal-user-nexus'},normalUserFixture.token);
    await createNexus({name:'admin-user-nexus'}, adminUserFixture.token);
    await createNexus({name:'another-normal-nexus'},normalUserFixture.token);
    const response = await request(app).get('/nexus/all')
                    .set('Authorization', `Bearer ${adminUserFixture.token}`)
                    .expect(200)
                    .send();
    expect(response.body.length).toBe(3);
});

test('Normal user should only be able to get all information of Nexus the user owns', async()=>{
    await createNexus({name:'mine'}, normalUserFixture.token);
    await createNexus({name:'also-mine'}, normalUserFixture.token);
    await createNexus({name:'admin\s'}, adminUserFixture.token);
    const response = await request(app).get('/nexus/all')
                    .set('Authorization', `Bearer ${normalUserFixture.token}`)
                    .expect(200)
                    .send();
    expect(response.body.length).toBe(2);
});

test('Should be able to create station under Nexus', async()=>{
    const nexusResponse = await createNexus({name:'nexus'}, normalUserFixture.token);
    const addStationResponse = await createStationUnderNexus(nexusResponse.body._id, 'order', normalUserFixture.token);
    const nexus = await Nexus.findById(nexusResponse.body._id);
    expect(nexus.stations[0]._id.toString()).toBe(addStationResponse.body._id);    
});

test('Should not be able to create station under Nexus owned by others', async()=>{
    const othersNexusResponse = await createNexus({name:'not-user\'s-nexus'}, adminUserFixture.token);
    await request(app).post('/nexus/addStation')
                    .set('Authorization', `Bearer ${normalUserFixture.token}`)
                    .expect(404)
                    .send({
                        nexusId: othersNexusResponse.body._id,
                        stationType: 'order'
                    });
    const othersNexus = await Nexus.findById(othersNexusResponse.body._id);
    expect(othersNexus.stations.length).toBe(0);
});

test('Added Stations should not exceed \'maxStations\'', async()=>{
    const createNexusResponse = await createNexus({name:'max2', maxStations:2}, normalUserFixture.token);
    await createStationUnderNexus(createNexusResponse.body._id,'order',normalUserFixture.token);
    await createStationUnderNexus(createNexusResponse.body._id,'order',normalUserFixture.token);
    await request(app).post('/nexus/addStation')
                    .set('Authorization', `Bearer ${normalUserFixture.token}`)
                    .expect(400)
                    .send({
                        nexusId: createNexusResponse.body._id.toString(),
                        stationType: 'order'
                    });
    const nexus = await Nexus.findById(createNexusResponse.body._id);
    expect(nexus.stations.length).toBe(2);
});

test('Should be able to delete a Nexus', async()=>{
    const createNexusResponse = await createNexus({name: 'tobe-deleted'}, normalUserFixture.token);
    const deleteNexusResponse = await deleteNexus(createNexusResponse.body._id, normalUserFixture.token);
    const deletedNexus = await Nexus.findById(deleteNexusResponse.body._id);
    expect(deletedNexus).toBeNull();
});

test('Should be able to delete a Station under Nexus', async()=>{
    const response = await createNexus({name:'myNexus'},normalUserFixture.token);
    const stationResponse = await createStationUnderNexus(response.body._id,'order',normalUserFixture.token);
    await deleteStationUnderNexus(response.body._id, stationResponse.body._id, normalUserFixture.token);
    const deletedStation = await Station.findById(stationResponse.body._id);
    expect(deletedStation).toBeNull();    
});

test('Stations under deleted Nexus should be deleted', async()=>{
    const createNexusResponse = await createNexus({name:'tobe-deleted'}, normalUserFixture.token);
    const createStationResponse = await createStationUnderNexus(createNexusResponse.body._id,'order',normalUserFixture.token);
    await deleteNexus(createNexusResponse.body._id, normalUserFixture.token);
    const station = await Station.findById(createStationResponse.body._id);
    expect(station).toBeNull();
});

