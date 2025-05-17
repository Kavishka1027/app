const express = require("express");
const router = express.Router();

const sellItemController = require("../controllers/sellItemController");

router.get("/", sellItemController.getAllSellItems);
router.post("/addSellItem", sellItemController.createSellItem);
router.delete("/deleteSellItem/:id", sellItemController.deleteItem);

//for user
router.get(
  "/user/availableItem/:type",
  sellItemController.getAvailableItemsByType
);
router.get("/user/availableDogs", sellItemController.getAvailableDogs);

module.exports = router;
