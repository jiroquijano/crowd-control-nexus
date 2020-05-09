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
        res.status(500).send({error:error.message});
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

//see current user info
router.get('/users/me',auth,(req,res)=>{
    res.send(req.user);
});

//update user
router.patch('/users/update',auth,async (req,res)=>{
    try{
        const allowedUpdates = req.user.accountType === 'admin' ?
            ['username','email','password','accountType'] : ['username','email','password'];
        const fieldsToUpdate = Object.keys(req.body).filter(curr => allowedUpdates.includes(curr));
        fieldsToUpdate.forEach((curr)=>{
            req.user[curr] = req.body[curr];
        });
        await req.user.save();
        res.send(req.user);
    }catch(error){
        res.status(400).send({error:error.message});
    }
});

module.exports = router;