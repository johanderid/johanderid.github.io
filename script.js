const player1ScoreDisplay = document.getElementById('player1-score');
const player2ScoreDisplay = document.getElementById('player2-score');
const numberButtons = document.getElementById('number-buttons');
const doubleButton = document.getElementById('double-button');
const tripleButton = document.getElementById('triple-button');
const missButton = document.getElementById('miss-button');
const newGameButton = document.getElementById('new-game-button');
const messageArea = document.getElementById('message-area');

let player1Score = 501;
let player2Score = 501;
let currentPlayer = 1; // 1 for Player 1, 2 for Player 2

// Create number buttons dynamically
for (let i = 0; i <= 180; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.addEventListener('click', () => handleScoreInput(i));
    numberButtons.appendChild(button);
}

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

function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
}

function checkForWinner() {
    if (player1Score === 0) {
        messageArea.textContent = "Player 1 wins!";
    } else if (player2Score === 0) {
        messageArea.textContent = "Player 2 wins!";
    }
}

newGameButton.addEventListener('click', () => {
    player1Score = 501;
    player2Score = 501;
    player1ScoreDisplay.textContent = player1Score;
    player2ScoreDisplay.textContent = player2Score;
    messageArea.textContent = ""; // Clear any messages
    currentPlayer = 1;
});


// ... (More JavaScript will be added later for double/triple, miss, averages, etc.)