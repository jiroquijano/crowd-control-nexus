const express = require('express');
const router = new express.Router();
const Client = require('../db/models/client-model');

//todo: create middleware to verify client access

router.get('/client/:id', async (req,res)=>{
    try{
        const client = await Client.findOne({_id: req.params.id});
        if(!client) throw new Error(`client not found!`);
        res.send(client);
    }catch(error){
        res.status(404).send({error: error.message});
    }
});

router.post('/client/edit/:id', async (req,res)=>{ 
    const modificationRequest = req.body;
    const allowedModifications = Object.keys(modificationRequest).filter((modification)=>{
        return ['name','mobile'].includes(modification);
    });
    try{
        const client = await Client.findOne({_id: req.params.id});
        if(!client) return res.status(404).send({error: 'client not found!'});
        allowedModifications.forEach((modification)=>{
            client[modification] = modificationRequest[modification];
        });
        await client.save();
        res.send(client);
    }catch(error){
        res.status(500).send({error:error.message});
    }
});

module.exports = router;