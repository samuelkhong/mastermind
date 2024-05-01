const Game = require('../models/gameModel');


exports.startNewGame = async (req, res) => {
    try {
        // generate secect code first. necessary since async and cannot pass promise directly to secretCode
        const secretCode = await generateSecretCode();
        const difficulty = req.body.difficulty;

        // Create a new game
        const newGame = await Game.create({
            userId: req.session.passport.user,
            secretCode: secretCode, // Function to generate a random secret code
            difficulty: difficulty,
            board: intializeBoard(difficulty)
        });
        res.redirect(`/game/${newGame._id}`);
    } catch (error) {
        console.error('Cannot Create a new Game:', error);
        res.status(500).json({ error: 'Failed to create a new game.' });
    }
};

exports.redirectGame = async (req, res) => {
    try {
        // get id from post req 
        // console.log(req.body)
        const gameId = req.body.gameId;

        // Find the game by gameId
        const game = await Game.findById(gameId);

        // Check if game exists
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }
        
        // if game exist, route to url with id in the url 
        res.redirect(`/game/${gameId}`);


 
    } catch (error) {
        console.error('Error loading game:', error);
        res.status(500).json({ error: 'Failed to load game' });
    }
}

exports.loadGame = async (req, res) => {
    // get id from url 
        const gameId = req.params.id;
        // Find the game by gameId
        const game = await Game.findById(gameId);
        
        // Check if game exists
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }

        // Render game with game info
        res.render(`game`, {game});
        

}

// updates the board
exports.updateGame = async (req, res) => {
    try {
        // // get guesses from form submisson and validate
        // const guess1 = Number(req.body.guess1);
        // const guess2 = Number(req.body.guess2);
        // const guess3 = Number(req.body.guess3);
        // const guess4 = Number(req.body.guess4);
        
        // const isValid = (guess) => {
        //     return Number.isInteger(guess) && guess >= 0 && guess <= 7;
        // }
        // // check if any of the guesses are not valid. 
        // if (!isValid(guess1) ||
        //     !isValid(guess2) ||
        //     !isValid(guess3) ||
        //     !isValid(guess4)) {
        //         return res.status(400).json({ error: 'Invalid guess. Guesses must be integers between 0 and 7.' });
        //     }

        // Get the gameId from the URL parameters
        const gameId = req.body.gameId;

        // Find the game by gameId
        const game = await Game.findById(gameId);

        // Check if game exists
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }
        // check if exceeded the max turns
        if (game.turnCount >= 10) {
            // make sure game state is set to loss
            game.status = 'lost';
            await game.save();
            res.redirect(`/game/${game._id}`);
        }

        // get guesses based on difficulty
        let guesses = [];
        switch (game.difficulty) {
            case 'easy':
                guesses = [1, 2, 3, 4];
                break;
            case 'medium':
                guesses = [1, 2, 3, 4, 5, 6 ];
                break;
            case 'hard':
                guesses = [1, 2, 3, 4, 5, 6, 7, 8];
                break;
            default:
                guesses = [1, 2, 3, 4];
                break;
        }
        // Get guesses from form submission and validate
        const guessValues = guesses.map(guessNumber => Number(req.body[`guess${guessNumber}`]));
        if (!isValidInput(guessValues)) {
            return res.status(400).json({ error: 'Invalid guess. Guesses must be integers between 0 and 7.' });

        };


        // Concatonate Guesses into an array
        // const guessArr = [guess1, guess2, guess3, guess4];

        // initalize feedback 
        let feedback = {
            exactMatches:0,
            partialMatches: 0
        };

        // compare guessArr to Secret code and fill feedback
        getFeedback(guessValues, game.secretCode, feedback); 

        // convert feedback into String message
        const feedbackStr = feedbackToString(feedback);
        // add feedback to feedback arr in game
        game.feedback[10 - game.turnCount] = feedbackStr;

        // update the board
        updateBoard(game.board, guessValues, game.turnCount);

        // check if you won!
        if (checkWin(feedback, game.secretCode)) {
            // change game state to win!
            game.status = 'won';
        }
        else {
            //increment turn
            game.turnCount++;

        }
        //save game
        await game.save();

        //after saving game. redirect to post request to loadGame
        res.redirect(`/game/${game._id}`);

    }
    catch (error) {

    }
}

// validate form input 
function isValidInput(guesses) {
    // for every guess check if its true. If there is a false terminates early returns false
    return guesses.every((guess) => {
        return Number.isInteger(guess) && guess >= 0 && guess <= 7;
    });
    
}

// updates the board with guessArr values
function updateBoard(board, guessArr, turn) {
    board[10 - turn] = guessArr;
}

// converts feedback object to a string displayed on board
function feedbackToString(feedback) {
    if (feedback.exactMatches === 0 && feedback.partialMatches === 0) {
        return "all incorrect"
    }
    return `${feedback.exactMatches + feedback.partialMatches} correct number and ${feedback.exactMatches} correct location`
}


// determine if win 
function checkWin(feedback, secrectCodeArr) {
    if (feedback.exactMatches === secrectCodeArr.length) {
        return true;
    }
    return false;
}


// calc the num of correct locations/ num and number of correct
function getFeedback(guessArr, secretCodeArr, feedback) {
    let correctNumLoc = 0;
    let correctNumOnly = 0;

    // keep track of matching indexes
    const guessIndexMatch = new Set();
    const secectIndexMatch = new Set();

    // find correct num and location and update matching indexes
    for (let i = 0; i < guessArr.length; i++) {
        if (guessArr[i] === secretCodeArr[i]) {
            correctNumLoc++;
            guessIndexMatch.add(i);
            secectIndexMatch.add(i);
        }
    }

    // find match number but not at right position
    for (let i = 0; i < guessArr.length; i++) { 
        // skip indexes where match num and location. Avoid double count
        if (guessIndexMatch.has(i)) {
            continue;
        }
        // find first occurance of matching num not in correct pos
        const secretCodeIndex = secretCodeArr.indexOf(guessArr[i]); // find the first occurance of the value at guessArr[i] in secret Arr
        if (secretCodeIndex !== -1 && !secectIndexMatch.has(secretCodeIndex)) { // see if secrect index has bene prev mathced
            correctNumOnly++;
            secectIndexMatch.add(secretCodeIndex);
        }
    }
    // update feedback object
    feedback.exactMatches = correctNumLoc;
    feedback.partialMatches =  correctNumOnly;
}


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
        
        return generatedNumber;

    } catch (error) {
        console.error(error);
    }
}
// intializes board with empty #
function intializeBoard(difficulty) {
    const row = 10;
    let col = 4;
    // set difficulty
    if (difficulty === 'medium') {
        col = 6;
    }
    else if (difficulty === 'hard') {
        col = 8;
    }
    const board = new Array(row);
    for (let i = 0; i < row; i++) {
        board[i] = new Array(col).fill('#');
    }
    return board;
}


