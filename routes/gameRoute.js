const express = require('express');
const router = express.Router()
const gameController = require('../controllers/gameController')
const Game = require('../models/gameModel')

router.get('/', gameController.getGamesHome);

router.post('/newGame', gameController.startNewGame);
router.post('/loadGame', gameController.redirectGame);
router.get('/:id', gameController.loadGame)
router.post('/guess', gameController.updateGame)


module.exports = router;