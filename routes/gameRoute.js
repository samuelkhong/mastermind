const express = require('express');
const router = express.Router()
const gameController = require('../controllers/gameController')

router.get('/', (req, res) => {
    res.render('gameSelection.ejs');
});

router.post('/newGame', gameController.startNewGame);


module.exports = router;