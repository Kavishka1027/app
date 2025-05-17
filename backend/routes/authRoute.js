const express = require('express');
const router = express.Router();
const authController = require('../controllers/authUserController');

router.post('/reqPassword', authController.recoverPassword);
router.post('/resetPassword/:token', authController.resetPassword);

module.exports = router;
