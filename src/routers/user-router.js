const express = require('express');
const User = require('../db/models/user-model');
const auth = require('../middleware/auth');
const router = new express.Router();

//create user route
//{username,email,password,accounttype}
router.post('/users',async(req,res)=>{
    try{
        const user = new User(req.body);
        const token = await user.generateToken();
        await user.save();
        res.status(201).send({user,token});
    }catch(error){
        res.status(500).send({error});
    }
});

//login user
router.post('/users/login', async(req,res)=>{
    try{
        const user = await User.verifyCredentials(req.body.email, req.body.password);
        const token = await user.generateToken();
        res.send({user,token});
    }catch(error){
        res.status(400).send({error:'Credentials not correct'});
    }
});

module.exports = router;