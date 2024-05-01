const express = require('express');
const router = express.Router()
const gameController = require('../controllers/gameController')
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get('/',ensureAuth,  gameController.getGamesHome);

router.post('/newGame', ensureAuth, gameController.startNewGame);
router.post('/loadGame', ensureAuth, gameController.redirectGame);
router.get('/:id', ensureAuth, gameController.loadGame)
router.post('/guess', ensureAuth, gameController.updateGame)


module.exports = router;