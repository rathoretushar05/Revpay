const User = require("../Models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function register(req,res){
    const {username, password} = req.body;
    try{
        const hashpassword = await bcrypt.hash(password, 10);
        const profile = new User({username, password : hashpassword});
        await profile.save();
        return res.status(201).send({message : "User registered successfully"});
    }
    catch(err){
        return res.status(400).send({error : `${err.message} hai ji`});
    }
};

async function login(req,res){
    const {username,password}=req.body;
    try{
        const profile = await User.findOne({username});
        if(!profile){
            return res.status(400).send({error:"Invalid credentials"});
        }
        const ismatch = await bcrypt.compare(password,profile.password);
        if(!ismatch){
            return res.status(400).send({error : "Invalid Credentials"});
        }
        const token = jwt.sign({id : profile._id},"SECRETKEY", {expiresIn : "5h"});
        
        return res.send({token});
    }
    catch(err){
        return res.status(500).send({error : "Server Error"});
    }
};

module.exports = {
    register,
    login,
};