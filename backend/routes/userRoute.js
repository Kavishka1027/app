const express = require("express");
const router = express.Router();

const authenticateUser = require("../middlewares/authenticateUser");

const userModel = require("../models/userModel");
const userController = require("../controllers/userController");
const { forgotPassword, resetPassword } = require('../controllers/userController');

// Routes for handling users
router.get("/", userController.getAllUsers);
router.get("/customers", userController.getAllCustomers);
router.get("/veterinarians", userController.getAllVeterinarians);
router.put("/:id", userController.updateUser);
router.get("/:id", userController.getUserById);
router.delete("/:id", userController.deleteUser);

// Authentication routes
router.post("/login", userController.loginUser);
router.post('/forgotPassword', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post("/logout", userController.logoutUser);

// User registration route
router.post("/register", userController.addUser);

// Fetch the logged-in user's profile
router.get("/me", authenticateUser, userController.getLoggedInUser);



// Route to check if a user is authenticated
router.get('/check-auth', (req, res) => {
  if (req.session.user && req.session.user.userId) {
    res.json({ loggedIn: true, userId: req.session.user.userId });
  } else {
    res.json({ loggedIn: false });
  }
});

module.exports = router;
