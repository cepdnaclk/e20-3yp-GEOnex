const express = require('express');
const dotenv = require('dotenv');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
module.exports = router;