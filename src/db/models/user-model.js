const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'defaultsecretkey'

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        unique: true,
        validate(emailAddress){
            if(!validator.isEmail(emailAddress)){
                throw new Error('Please double check email address');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(value.length < 8) {
                throw new Error('Password must be equal or greater than 8 characters');
            }
        }
    },
    token:{
        type:String,
        required: true
    },
    accountType:{
        type: String,
        default: 'normal'
    }
});

//save prehook for encrypting password
userSchema.pre('save',async function (next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8);
    }
    next();
});

//generate tokens for authentication
userSchema.methods.generateToken = async function(){
    const user = this;
    const token = jwt.sign({_id: user.id}, SECRET_KEY);
    user.token = token;
    await user.save();
    return token;
};

//verify email and password
userSchema.statics.verifyCredentials = async (email,password)=>{
    const user = await User.findOne({email});
    if(!user) throw new Error('Credentials not correct!');
    const result = await bcrypt.compare(password,user.password);
    if(!result) throw new Error('Credentials not correct!');
    return user;
}

const User = mongoose.model('User',userSchema);
module.exports = User;