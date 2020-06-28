const {normalUserFixture} = require('../fixtures/db-fixture');
const {createNexus, createStationUnderNexus} = require('./nexus-helpers');

const createNewStationUnderNexus = async () =>{
    const nexus = await createNexus({name:'myNewNexus'},normalUserFixture.token);
    const station = await createStationUnderNexus(nexus.body._id,'order', normalUserFixture.token);
    return station;
};

module.exports = {createNewStationUnderNexus}