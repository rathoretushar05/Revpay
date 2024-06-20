const jwt = require("jsonwebtoken");

function authmiddleware(req,res,next){
    const token = req.header("Authorization");
    console.log(token);
    if(!token){
        return res.status(401).send({error : "no Token, Authorization Failed"});
    }
    try{
        const decoded = jwt.verify(token,"SECRETKEY");
        req.userid=decoded;
        next();
    }
    catch(err){
        return res.status(401).send({error:"Token not Valid"});
    }

};

module.exports = authmiddleware;
