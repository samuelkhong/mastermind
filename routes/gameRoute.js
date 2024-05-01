const express = require('express');
const router = express.Router()
const gameController = require('../controllers/gameController')
const Game = require('../models/gameModel')

router.get('/', (req, res) => {
    res.render('gameSelection.ejs');
});

router.post('/newGame', gameController.startNewGame);
router.post('/loadGame', gameController.redirectGame);
router.get('/:id', gameController.loadGame)
router.post('/guess', gameController.updateGame)

// router.post('/loadGame', async (req, res) => {
//     try {
//         // get id from url 
//         const gameId = req.body.gameId;

//         // Find the game by gameId
//         const game = await Game.findById(gameId);

//         // Check if game exists
//         if (!game) {
//             return res.status(404).json({ error: 'Game not found' });
//         }

//         // Return the loaded game
//         res.json({ message: 'Game loaded successfully', game });
//     } catch (error) {
//         console.error('Error loading game:', error);
//         res.status(500).json({ error: 'Failed to load game' });
//     }
// });



module.exports = router;