const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // userID tracks game to the user
    secretCode: { type: [Number], required: true },
    board: { type: [[String]], required: true },
    feedback: { type: [String], required: true, default: () => new Array(10).fill('') }, // Array of 10 empty strings
    status: { type: String, enum: ['ongoing', 'won', 'lost'], default: 'ongoing' }, 
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' }, 
    turnCount: { type: Number, required: true, default: 1 }

});


// Create a Game model based on the schema
const Game = mongoose.model('Game', gameSchema);

module.exports = Game;