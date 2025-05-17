const express = require("express");
const router = express.Router();

const petModel = require("../models/petModel");
const petController = require("../controllers/petController");


router.post("/petRegister", petController.addPet);
router.get("/getAllPets", petController.getAllPets);
router.get("/dogs", petController.getAllDogs);
router.get("/cats", petController.getAllCats);
router.get("/:id", petController.getPetById);
router.get("/:id", petController.getPetById);


module.exports = router;
