const player1ScoreDisplay = document.getElementById('player1-score');
const player2ScoreDisplay = document.getElementById('player2-score');
const scoreInput = document.getElementById('score-input');
const submitScoreButton = document.getElementById('submit-score');
const doubleButton = document.getElementById('double-button');
const tripleButton = document.getElementById('triple-button');
const missButton = document.getElementById('miss-button');
const newGameButton = document.getElementById('new-game-button');
const messageArea = document.getElementById('message-area');

let player1Score = 501;
let player2Score = 501;
let currentPlayer = 1;

submitScoreButton.addEventListener('click', () => {
    const enteredScore = parseInt(scoreInput.value); // Get the entered score

    if (isNaN(enteredScore) || enteredScore < 0 || enteredScore > 180) {
        alert("Please enter a valid score between 0 and 180.");
        return; // Don't process invalid input
    }

    handleScoreInput(enteredScore);
    scoreInput.value = ""; // Clear the input field
});

doubleButton.addEventListener('click', () => {
    const enteredScore = parseInt(scoreInput.value);
    if (isNaN(enteredScore) || enteredScore < 0 || enteredScore > 180) {
        alert("Please enter a valid score between 0 and 180.");
        return; // Don't process invalid input
    }
    handleScoreInput(enteredScore * 2);
    scoreInput.value = ""; // Clear the input field
});

tripleButton.addEventListener('click', () => {
    const enteredScore = parseInt(scoreInput.value);
    if (isNaN(enteredScore) || enteredScore < 0 || enteredScore > 180) {
        alert("Please enter a valid score between 0 and 180.");
        return; // Don't process invalid input
    }
    handleScoreInput(enteredScore * 3);
    scoreInput.value = ""; // Clear the input field
});

missButton.addEventListener('click', () => {
    handleScoreInput(0); // A miss is a score of 0
    scoreInput.value = ""; // Clear the input field
});

function handleScoreInput(score) {
    if (currentPlayer === 1) {
        player1Score -= score;
        player1ScoreDisplay.textContent = player1Score;
    } else {
        player2Score -= score;
        player2ScoreDisplay.textContent = player2Score;
    }
    switchPlayer();
    checkForWinner();
}

// ... (Rest of the JavaScript code - switchPlayer, checkForWinner, new game, etc. - remains the same)