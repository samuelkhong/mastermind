const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // userID tracks game to the user
    secretCode: { type: [Number], required: true },
    board: { type: [[String]], required: true },
    feedback: [{ 
        exactMatches: { type: Number, required: true }, 
        partialMatches: { type: Number, required: true }, 
    }],
    turnCount: { type: Number, required: true }
});


// Create a Game model based on the schema
const Game = mongoose.model('Game', gameSchema);

module.exports = Game;