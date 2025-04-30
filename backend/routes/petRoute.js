const express = require("express");
const router = express.Router();

const petModel = require("../models/petModel");
const petController = require("../controllers/petController");


router.post("/petRegister", petController.addPet);



module.exports = router;