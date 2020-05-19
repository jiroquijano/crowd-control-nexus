const express = require('express');
const Nexus = require('../db/models/nexus-model');
const auth = require('../middleware/auth');
const router = new express.Router();

//Creates new Nexus in DB
router.post('/nexus/create',auth, async(req,res)=>{
    const newNexus = new Nexus(req.body);
    newNexus.creator = req.user._id;
    try{
        await newNexus.save();
        res.status(201).send(newNexus);
    }catch(error){
        res.status(500).send({error:error.message});
    }
});

//Get all created Nexus under account
router.get('/nexus/all',auth,async(req,res)=>{
    try{
        const results = req.user.accountType === 'admin' ? 
            await Nexus.find({}) : 
            await Nexus.find({
                creator: req.user._id
            });
        if(!results) return res.status(404).send()
        res.send(results);
    }catch(error){
        res.status(500).send({error:error.message});
    }
});

//Fetch Nexus by ID
router.get('/nexus/:id',auth, async(req,res)=>{
    try{
        const nexus = req.user.accountType === 'admin' ? 
            await Nexus.findOne({
                _id: req.params.id
            }) : 
            await Nexus.findOne({
                _id: req.params.id,
                creator: req.user._id
            });
        if(!nexus) return res.status(404).send();
        res.send(nexus);
    }catch(error){
        res.status(500).send({error:error.message});
    }
});

//add station to Nexus.
// POST body: {nexusId, stationType}
router.post('/nexus/addstation',auth,async (req,res)=>{
    try{
        const nexus = req.user.accountType === 'admin' ? 
            await Nexus.findOne({
                _id: req.body.nexusId
            }) : 
            await Nexus.findOne({
                _id: req.body.nexusId,
                creator: req.user._id
            });
        if(!nexus) return res.status(404).send();
        const station = await nexus.addStation(req.body.stationType, req.user);
        if(station.error) return res.status(400).send();
        nexus.stations.push(station._id);
        nexus.save();
        res.status(201).send(station);
    }catch(error){
        res.status(400).send({error:error.message});
    }
});

//delete station with specified id
//DELETE body: {nexusId, stationId}
router.delete('/nexus/deleteStation',auth, async (req,res)=>{
    try{
        const nexus = req.user.accountType === 'admin' ?
            await Nexus.findOne({_id:req.body.nexusId}) :
            await Nexus.findOne({_id:req.body.nexusId, creator:req.user._id});
        if(!nexus) return res.status(404).send();
        const station = await nexus.deleteStation(req.body.stationId, req.user);
        if(station.error) return res.status(400).send();
        nexus.stations = nexus.stations.filter(curr => curr.toString() !== req.body.stationId);
        await nexus.save();
        res.send(nexus);
    }catch(error){
        res.status(400).send({error:error.message});
    }
});

//deletes a nexus with specified id
router.delete('/nexus/:id', auth, async(req,res)=>{
    try{
        const nexus = req.user.accountType === 'admin' ? 
            await Nexus.findOne({_id: req.params.id}):
            await Nexus.findOne({_id: req.params.id, creator: req.user._id});
        if(!nexus) return res.status(404).send();
        await nexus.deleteOne({_id: req.params.id});
        res.send(nexus);
    }catch(error){
        res.status(500).send({error:error.message});
    }
});

module.exports = router;