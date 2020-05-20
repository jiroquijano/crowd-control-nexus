const app = require('../../src/app');
const request = require('supertest');

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

module.exports = {
    createNexus,
    deleteNexus,
    getNexusById,
    createStationUnderNexus,
    deleteStationUnderNexus
};