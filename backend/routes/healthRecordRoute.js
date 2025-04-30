const express = require("express");
const router = express.Router();

const healthRecordModel = require("../models/healthRecordModel");
const healthRecordController = require("../controllers/healthRecordController");


router.post("/addHealthRecord",healthRecordController.addHealthRecord);


module.exports = router;