const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const accountschema = new mongoose.Schema({
    userid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true,
    },
    accountid : {
        type : String,
        required : true,
        unique : true
    },
    accountall : [
        {
            accountno : {
                type : String,
                required : true,
                match : /^\d{10}$/,
                unique : true,
                default: uuidv4
            },
            ifsccode : {
                type : String,
                require: true,
                match: /^\d{8}$/
            },
            status : {
                type : String,
                enum : ["ACTIVE", "INACTIVE"],
                default : "ACTIVE",
            },
            allowcredit : {
                type : Boolean,
                default : true,
            },
            allowdebit : {
                type : Boolean,
                default : true,
            },
            balance : {
                type : Number,
                default : 0,
            },
            dailywithdrawallimit : {
                type : Number,
                default : 10000,
            },
            dailywithdrawnlimit : {
                type : Number,
                default : 0,
            },
        }
    ],
   
    date : {
        type : Date,
        default : Date.now,
    },
    transaction : [
        {
            type : {
                type : String,
                enum : ["CREDIT","DEBIT"],
                required: true,
            },
            amount : {
                type : Number,
                required : true,
            },
            beneficaryaccount : {
                type : Number,
            },
            beneficaryifsc : {
                type : Number,
            },

        }
    ]

});

const account = mongoose.model("account",accountschema);

module.exports = account;
