const cells = document.querySelectorAll("[data-cell]");
const statusMessage = document.getElementById("status-message");
const resetButton = document.getElementById("reset");
const switchModeButton = document.getElementById("switch-mode");

let isPlayerVsComputer = false;
let currentPlayer = "X";
let gameState = Array(9).fill(null);
let isGameActive = true;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// Check for a winner
function checkWinner() {
    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            statusMessage.textContent = `Player ${currentPlayer} Wins! 🎉`;
            statusMessage.style.visibility = "visible";
            statusMessage.style.opacity = "1";
            isGameActive = false;
            return true;
        }
    }
    if (!gameState.includes(null)) {
        statusMessage.textContent = "It's a Draw! 🤝";
        statusMessage.style.visibility = "visible";
        statusMessage.style.opacity = "1";
        isGameActive = false;
        return true;
    }
    return false;
}

// Minimax Algorithm
function minimax(board, depth, isMaximizing) {
    const winner = checkWinForMinimax(board);
    if (winner === "X") return -10 + depth;
    if (winner === "O") return 10 - depth;
    if (!board.includes(null)) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = "O";
                let score = minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(bestScore, score);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = "X";
                let score = minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(bestScore, score);
            }
        }
        return bestScore;
    }
}

// Minimax Winner Check
function checkWinForMinimax(board) {
    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

// Computer Move
function getBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === null) {
            gameState[i] = "O";
            let score = minimax(gameState, 0, false);
            gameState[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function computerMove() {
    const bestMove = getBestMove();
    gameState[bestMove] = "O";
    cells[bestMove].textContent = "O";
    cells[bestMove].classList.add("taken");
    if (checkWinner()) return;
    currentPlayer = "X";
    statusMessage.textContent = `Player ${currentPlayer}'s Turn`;
}

// Handle Click
function handleClick(e) {
    const cell = e.target;
    const index = Array.from(cells).indexOf(cell);

    if (gameState[index] || !isGameActive) return;

    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add("taken");

    if (checkWinner()) return;

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusMessage.textContent = `Player ${currentPlayer}'s Turn`;

    if (isPlayerVsComputer && currentPlayer === "O") {
        setTimeout(() => {
            computerMove();
        }, 500);
    }
}

// Reset Game
function resetGame() {
    currentPlayer = "X";
    gameState = Array(9).fill(null);
    isGameActive = true;
    statusMessage.style.visibility = "hidden";
    statusMessage.style.opacity = "0";
    statusMessage.textContent = "Player X's Turn";
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("taken");
    });
}

// Switch Mode
function switchMode() {
    isPlayerVsComputer = !isPlayerVsComputer;
    resetGame();
    switchModeButton.textContent = isPlayerVsComputer
        ? "Switch to Player vs Player"
        : "Switch to Player vs Computer";
}

// Event Listeners
cells.forEach(cell => cell.addEventListener("click", handleClick));
resetButton.addEventListener("click", resetGame);
switchModeButton.addEventListener("click", switchMode);
