const request = require('supertest');
const app = require('../../src/app');

const createUser = async (newUser)=>{
    return await request(app).post('/users')
        .send(newUser)
        .expect(201);
};

const logInUser = async(credentials)=>{
    return await request(app).post('/users/login')
        .send(credentials)
        .expect(200);
};

module.exports = {
    createUser,
    logInUser
};