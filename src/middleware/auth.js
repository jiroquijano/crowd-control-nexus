const jwt = require('jsonwebtoken');
const User = require('../db/models/user-model');
const SECRET_KEY = process.env.USER_SECRET_KEY;

const auth = async (req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','');
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findOne({_id: decoded._id, token});
        if(!user) return res.status(401).send({error:'Please check authentication'});
        req.user = user;
        next();
    }catch(error){
       res.status(401).send({error:'Please check authentication'})
    }
}

module.exports = auth;