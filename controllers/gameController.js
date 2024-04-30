const Game = require('../models/gameModel');


exports.startNewGame = async (req, res) => {
    try {
        // generate secect code first. necessary since async and cannot pass promise directly to secretCode
        const secretCode = await generateSecretCode();

        // Create a new game
        const newGame = await Game.create({
            userId: req.session.passport.user,
            secretCode: secretCode, // Function to generate a random secret code
            board: intializeBoard(),
            feedback: [], // string array of past guessees
            turnCount: 1
            
        });
        res.json({ message: 'New Game.', gameId: newGame._id });
    } catch (error) {
        console.error('Cannot Create a new Game:', error);
        res.status(500).json({ error: 'Failed to create a new game.' });
    }
};

// gets an array of numbers used as mastermind code
async function generateSecretCode() {

    const url = "https://www.random.org/integers";

    // fetch request settings
    const settings = new URLSearchParams({
        //params based on mastermind
        num: 4,    
        min: 0,    
        max: 7,   
        col: 1,    
        base: 10,  
        format: "plain", 
        rnd: "new"
    });

    try {
        // Send  request
        const response = await fetch(url + '?' + settings);

        // if fail
        if (!response.ok) {
            throw new Error('Failed to retrieve a number. Status code: ' + response.status);
        }

        // Return the plain text response
        const data = await response.text();

        // Parse the response and split by number
        const generatedNumber = data.trim().split('\n').map(Number);

        console.log("Generated number:", generatedNumber);
        
        // convert string array into integer array
        
        return generatedNumber;

    } catch (error) {
        console.error(error);
    }
}

function intializeBoard() {
    const row = 10;
    const col = 4; 
    const board = new Array(row);
    for (let i = 0; i < row; i++) {
        board[i] = new Array(col).fill('#');
    }
    return board;
}


