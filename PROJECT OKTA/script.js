
AOS.init()


let isOnePlayerMode = true; // Default to 1 Player mode
let cells = Array(9).fill(null);
let gameOver = false;
let currentPlayer = 'X'; // Track current player in two-player mode

const onePlayerButton = document.getElementById('onePlayer');
const twoPlayerButton = document.getElementById('twoPlayer');
const board = document.getElementById('board');
const statusText = document.getElementById('status');

onePlayerButton.addEventListener('click', () => {
  isOnePlayerMode = true;
  resetGame();
});

twoPlayerButton.addEventListener('click', () => {
  isOnePlayerMode = false;
  resetGame();
});

function createBoard() {
  board.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.addEventListener('click', playerMove);
    board.appendChild(cell);
  }
}

function playerMove(event) {
  const index = event.target.dataset.index;
  if (cells[index] || gameOver) return;

  setTimeout(() => {
    let symbol;
    if (isOnePlayerMode) {
      symbol = 'X'; // Player is always X in 1P mode
    } else {
      symbol = currentPlayer; // Use currentPlayer in 2P mode
    }

    placeMove(index, symbol);

    if (gameOver) return;

    if (isOnePlayerMode) {
      statusText.textContent = "Bot's turn (O)";
      setTimeout(botMove, 500);
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      statusText.textContent = `Player ${currentPlayer === 'X' ? '1' : '2'}'s turn (${currentPlayer})`;
    }
  }, 300);
}

function botMove() {
  if (!isOnePlayerMode) return;

  const emptySpots = cells.map((v, i) => v === null ? i : null).filter(v => v !== null);
  if (emptySpots.length === 0) return;

  const randomIndex = emptySpots[Math.floor(Math.random() * emptySpots.length)];
  placeMove(randomIndex, 'O');

  if (!gameOver) {
    statusText.textContent = "Your turn (X)";
  }
}

function placeMove(index, symbol) {
  cells[index] = symbol;
  const cell = board.querySelector(`[data-index='${index}']`);
  cell.textContent = symbol;

  const win = checkWin();
  
  if (win) {
    highlightWin(win);
    statusText.textContent = `${symbol} wins!`;
    gameOver = true;
    document.getElementById('quizButton').classList.remove('d-none');

    if (symbol === 'O' && isOnePlayerMode) {
      setTimeout(() => {
        alert("Bot wins! Try again!");
        document.getElementById('quizButton').classList.remove('d-none');
      }, 1000);
    } else if (symbol === 'O' && !isOnePlayerMode) {
      setTimeout(() => {
        alert("Player 2 wins! Try again!");
        document.getElementById('quizButton').classList.remove('d-none');

      }, 1000);
    }
  } else if (cells.every(cell => cell)) {
    statusText.textContent = "It's a draw!";
    gameOver = true;
    document.getElementById('quizButton').classList.remove('d-none');
  }
}

function checkWin() {
  // All possible winning combinations
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return pattern; // Return the winning combination
    }
  }
  return null;
}

function highlightWin(winningCells) {
  for (const index of winningCells) {
    const cell = board.querySelector(`[data-index='${index}']`);
    cell.classList.add('winning-cell');
  }
}

function resetGame() {
  cells = Array(9).fill(null);
  gameOver = false;
  currentPlayer = 'X'; // Reset to X
  statusText.textContent = isOnePlayerMode ? "Your turn (X)" : "Player 1's turn (X)";
  document.getElementById('quizButton').classList.add('d-none');
  createBoard();
}

// Initialize the board
createBoard();