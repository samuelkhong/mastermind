const express = require('express');
const router = express.Router();
const authController = require("../controllers/auth");

// login routes get and post
router.get('/login', authController.getLogin)
router.post('/login', authController.postLogin)

//registration routes get and post
router.get('/register', authController.getSignup)
router.post('/register', authController.postSignup)
// logout
router.get('/logout', authController.logout)


module.exports = router