const account = require("../Models/account");
const { v4: uuidv4 } = require('uuid');

async function createaccount(req,res){
    console.log("in account");
    const {accountno, ifsccode, status,allowcredit,allowdebit,balance,dailywithdrawallimit,dailywithdrawnlimit}=req.body;
    const Id = req.userid.id;
    try{
        const existuser = await account.findOne({userid : Id});
 
        if(existuser ){
            const existaccount = existuser.accountall.find(obj => obj.accountno === accountno);
            if (!existaccount) {
                // Account doesn't exist, so we can create a new one
                existuser.accountall.push({accountno, ifsccode, status, allowcredit, allowdebit, balance, dailywithdrawallimit, dailywithdrawnlimit});
                await existuser.save();
                return res.status(201).send(existuser);
            }
            else{
                return res.status(400).send("Account Already exists");
            }
        }
        else{
            
            const newaccount = await new account({
                userid: req.userid.id,
                accountid: uuidv4(),
            });
            newaccount.accountall.push({accountno, ifsccode, status,allowcredit,allowdebit,balance,dailywithdrawallimit,dailywithdrawnlimit});
            console.log(accountno);
            console.log(newaccount);
            await newaccount.save();
            console.log(newaccount);
            return res.status(201).send(newaccount);
        }
    }
    catch(err){ 
        return res.status(400).send({error : err.message});
    }
};

async function getbalance(req,res){
    const {accountid,accountno} = req.body;
    try{
        const useraccount = await account.findOne({accountid});
        // console.log(useraccount);
        if(!useraccount){
            res.status(404).send({error : "Account Id Does not Exist"});
        }
        const userbalance = useraccount.accountall.find(obj=> obj.accountno ===accountno);
        console.log(userbalance);
        return res.send({Balance : userbalance.balance});
    }
    catch(err){
        return res.status(500).send({error : "Server Error"});
    }
};

async function createtransaction(req,res){
    const {accountid, accountno, type, amount, beneficaryid, beneficaryaccount, beneficaryifsc}=req.body;
    
    try{
        const userprofile = await account.findOne({accountid});
        if(!userprofile)
            return res.status(404).send({error : "Account Not Found"});

        const useraccount = userprofile.accountall.find(obj=> obj.accountno ===accountno);
        if(useraccount.status!=="ACTIVE"){
            return res.status(400).send({error : "Account is Inactive"});
        }
        const today = new Date();
        const lastday = new Date(useraccount.date);
        if(today.toDateString !=lastday.toDateString){
            useraccount.dailywithdrawnlimit=0;
            useraccount.date=today
        }
        if(type === "Debit" && (!useraccount.allowdebit)){
            return res.status(400).send({error : "Debit Transaction Not Allowed"});
        }
        if(type === "CREDIT" && (!useraccount.allowcredit)){
            return res.status(400).send({error : "Credit Transaction Not Allowed"});
        }
        if(type==="DEBIT" && (amount > useraccount.balance)){
            return res.status(400).send({error : "Not Enough Balance"});
        }
        if(type==="DEBIT" && (amount > (useraccount.dailywithdrawallimit-useraccount.dailywithdrawnlimit))){
            return res.status(400).send({error : "Daily Transaction Limit Exceeds"});
        }
        //userprofile.transaction.push({type, amount, beneficaryaccount, beneficaryifsc });
        if(type==="DEBIT"){
            useraccount.balance -= amount;
            useraccount.dailywithdrawnlimit+=amount; 
            userprofile.transaction.push({type, amount, beneficaryaccount : useraccount.accountno, beneficaryifsc : useraccount.ifsccode });
        }
        else if("CREDIT"){
            if(beneficaryaccount && beneficaryifsc){
                const beneficarydetail = await account.findOne({beneficaryid});
                const beneficary = beneficarydetail.accountall.find(obj=> obj.accountno===beneficaryaccount && obj.ifsccode===beneficaryifsc);
                if(beneficary && beneficary.status === "ACTIVE" && beneficary.allowcredit && amount<=useraccount.balance && amount < (useraccount.dailywithdrawallimit-useraccount.dailywithdrawnlimit)){
                    beneficary.balance+=amount;
                    useraccount.balance-=amount;
                    useraccount.dailywithdrawnlimit+=amount;
                    userprofile.transaction.push({type, amount, beneficaryaccount : beneficary.accountno, beneficaryifsc : beneficary.ifsccode });
                    await beneficarydetail.save();
                    await userprofile.save();
                    return res.status(201).send({balance : useraccount.balance, Beneficary_balance : beneficary.balance}); 
                }
                else{
                    return res.status(400).send({error : "Beneficary account not found or inactive or Credit is not allowed or amount exceeds"});
                }
            }
            else{
                useraccount.balance+=amount;  
                userprofile.transaction.push({type, amount, beneficaryaccount : useraccount.accountno, beneficaryifsc : useraccount.ifsccode });
                await userprofile.save();
            }     
        }
        return res.status(201).send({balance : useraccount.balance}); 

    }
    catch(err){
        return res.status(400).send({error : err.message});
    }
};

async function modifyaccount(req,res){
    const{accountid, accountno, status, allowcredit, allowdebit, balance, dailywithdrawallimit, dailywithdrawnlimit}=req.body;
    try{

        const userprofile = await account.findOne({accountid});
        if(userprofile){
            const useraccount = userprofile.accountall.find(obj=> obj.accountno === accountno);
            console.log("in profile");
            useraccount.accountall.updateOne({accountno, ifsccode, status,allowcredit,allowdebit,balance,dailywithdrawallimit,dailywithdrawnlimit});
            console.log("in profile");
        }
        else{
            return res.status(404).send({error : "Account Id is not correct"});
        }

    }
    catch(err){
        return res.status(400).send({error : err.message});
    }    
 
};

module.exports = {
    createaccount,
    getbalance,
    createtransaction,
    modifyaccount,
};

