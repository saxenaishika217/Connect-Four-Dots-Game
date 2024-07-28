const rows = 6;
const cols = 7;
const board = [];
let currentPlayer = 'red';
const winningCombination = [];

// Create the board
const boardElement = document.getElementById('board');
for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.addEventListener('click', handleClick);
        boardElement.appendChild(cell);
        row.push(null);
    }
    board.push(row);
}

function handleClick(event) {
    const col = parseInt(event.target.dataset.col);
    for (let row = rows - 1; row >= 0; row--) {
        if (!board[row][col]) {
            board[row][col] = currentPlayer;
            animatePieceFall(row, col);
            break;
        }
    }
}

function animatePieceFall(row, col) {
    let fallDistance = 0;
    const fallInterval = setInterval(() => {
        if (fallDistance <= row) {
            const previousCell = document.querySelector(`.cell[data-row='${fallDistance - 1}'][data-col='${col}']`);
            const currentCell = document.querySelector(`.cell[data-row='${fallDistance}'][data-col='${col}']`);
            
            if (previousCell) previousCell.classList.remove(currentPlayer);
            currentCell.classList.add(currentPlayer);
            fallDistance++;
        } else {
            clearInterval(fallInterval);

            if (checkWinner(row, col)) {
                winningCombination.forEach(([r, c]) => {
                    const winCell = document.querySelector(`.cell[data-row='${r}'][data-col='${c}']`);
                    winCell.classList.add('blink');
                });
                setTimeout(() => alert(`${currentPlayer.toUpperCase()} wins!`), 10);
                document.querySelectorAll('.cell').forEach(cell => cell.removeEventListener('click', handleClick));
            } else {
                currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
            }
        }
    }, 100);
}

function checkWinner(row, col) {
    return checkDirection(row, col, 1, 0) || // Horizontal
           checkDirection(row, col, 0, 1) || // Vertical
           checkDirection(row, col, 1, 1) || // Diagonal \
           checkDirection(row, col, 1, -1);  // Diagonal /
}

function checkDirection(row, col, rowDir, colDir) {
    let count = 1;
    winningCombination.length = 0;
    winningCombination.push([row, col]);

    for (let i = 1; i < 4; i++) {
        const r = row + i * rowDir;
        const c = col + i * colDir;
        if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === currentPlayer) {
            count++;
            winningCombination.push([r, c]);
        } else {
            break;
        }
    }

    for (let i = 1; i < 4; i++) {
        const r = row - i * rowDir;
        const c = col - i * colDir;
        if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === currentPlayer) {
            count++;
            winningCombination.push([r, c]);
        } else {
            break;
        }
    }

    return count >= 4;
}

