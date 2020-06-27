const express = require ('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const Station = require('../db/models/station-model');
const Client = require('../db/models/client-model');

router.get('/station/:id', auth, async (req,res)=>{
    try{
        const station = req.user.accountType === 'admin' ?
            await Station.findOne({_id: req.params.id}) :
            await Station.findOne({_id: req.params.id,
                creator: req.user._id});
        if(!station) {
            return res.status(404).send({error: `Station ${req.params.id} not found`})
        }
        res.send(station);
    }catch(error){
        res.status(500).send({error: error.messsage});
    }
});

router.post('/station/addclient',auth, async (req,res)=>{
    try{
        const stationInstance = await Station.findOne({_id: req.body.station_id});
        if(!stationInstance) return res.status(404).send({error: 'station ID not found'});
        const client = await stationInstance.addClient(req.body);
        if(client.error) return res.status(500).send({error: client.error});
        stationInstance.clients.push(client._id);
        await stationInstance.save();
        res.status(201).send(client);
    }catch(error){
        res.status(500).send({error: error.message});
    }
});


module.exports = router;