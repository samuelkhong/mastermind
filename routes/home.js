const express = require('express');
const router = express.Router()
const homeController = require('../controllers/home')
const { ensureAuth, ensureGuest } = require("../middleware/auth");


router.get('/',ensureAuth, homeController.getMenu); 

module.exports = router;