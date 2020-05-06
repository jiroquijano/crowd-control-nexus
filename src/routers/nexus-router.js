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
        res.status(500).send({error:'failed to create nexus'});
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

module.exports = router;