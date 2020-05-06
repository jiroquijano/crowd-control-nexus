const express = require('express');
const Nexus = require('../db/models/nexus-model');
const router = new express.Router();

//Creates new Nexus in DB
router.post('/nexus/create',async(req,res)=>{
    const newNexus = new Nexus(req.body);
    try{
        await newNexus.save();
        res.status(201).send(newNexus);
    }catch(error){
        res.status(500).send({error});
    }
});

//Fetch Nexus by ID
router.get('/nexus/:id',async(req,res)=>{
    const idQuery = req.params.id;
    try{
        const nexus = await Nexus.findById(idQuery);
        if(!nexus) return res.status(404).send({error: `No Nexus found with ID: ${idQuery}`});
        res.send(nexus);
    }catch(error){
        res.status(500).send({error});
    }
});

//add station to Nexus.
// POST body: {nexusId, stationType}
router.post('/nexus/addstation',async (req,res)=>{
    try{
        const nexus = await Nexus.findById(req.body.nexusId);
        if(!nexus) return res.status(404).send({error:`No nexus with ${req.body.nexusId} found!`});
        const result = await nexus.addStation(req.body.stationType);
        if(result.error) return res.status(400).send({error:result.error});
        res.send(nexus);
    }catch(error){
        res.status(400).send({error});
    }
});

module.exports = router;