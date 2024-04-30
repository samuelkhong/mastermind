// models/gameModel.js

const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // userID tracks game to the user
    secretCode: { type: [Number], required: true }, // secrect code for the game
    feedback: { type: [String], required: true }, // string array for feedback based on player input
    guesses: { type: [Number], required: true }, // Array to store user's guesses
    turnCount: { type: Number, required: true }
    
});

// Create a Game model based on the schema
const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
