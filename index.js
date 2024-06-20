const express = require("express");
const bodyparser = require("body-parser");
const {connectmongo} = require("./connect");
const authroutes = require("./Routes/authroutes");
const accountroutes = require("./Routes/accountroutes");

const app = express();
const port = 5005;
app.use(express.json());
app.use(bodyparser.json());
app.use(express.static('public'));


app.use("/api/auth", authroutes);
app.use("/api", accountroutes);


connectmongo("mongodb://127.0.0.1:27017/revpay")
.then(()=> console.log("MongoDb Started!!"))
.catch((err)=> console.log(err));

app.listen(port, ()=>{
    console.log(`Server started on Port ${port}`);
});