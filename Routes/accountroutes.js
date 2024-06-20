const express = require("express");
const { createaccount, getbalance, createtransaction,modifyaccount } = require("../controllers/accountcontroller");
const authmiddleware = require("../middleware/authmiddleware"); 

const router = express.Router();

router.post("/account", authmiddleware, createaccount);
router.post("/account/balance", authmiddleware, getbalance);
router.post("/account/transaction", authmiddleware, createtransaction);
router.post("/account/modifyaccount", authmiddleware, modifyaccount);


module.exports = router;