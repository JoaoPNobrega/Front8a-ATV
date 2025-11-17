const figures = Array.from(document.querySelectorAll('.figure'));
const playBtn = document.getElementById('playBtn');
const resetBtn = document.getElementById('resetBtn');
const timerLabel = document.getElementById('timer');
const resultLabel = document.getElementById('resultado');
const historyBody = document.getElementById('historyBody');

const baseColors = [
  '#f94144',
  '#f3722c',
  '#f8961e',
  '#f9844a',
  '#f9c74f',
  '#90be6d',
  '#43aa8b',
  '#577590',
  '#277da1'
];

let countdownId = null;
let timeLeft = 30;
let winningIndex = null;
let isInGame = false;
let hasResult = false;

function resetFiguresVisual() {
  figures.forEach((figure, index) => {
    figure.classList.remove('state-green', 'state-red', 'state-yellow');
    figure.style.setProperty('--base-color', baseColors[index]);
    figure.disabled = false;
  });
}

function updateTimerLabel() {
  const seconds = String(timeLeft).padStart(2, '0');
  timerLabel.textContent = `00:${seconds}`;
}

function stopCountdown() {
  if (countdownId) {
    clearInterval(countdownId);
    countdownId = null;
  }
}

function appendHistoryRow(resultText, modifier) {
  const row = document.createElement('tr');
  row.className = `history__row history__row--${modifier}`;
  const cell = document.createElement('td');
  cell.textContent = resultText;
  row.appendChild(cell);
  historyBody.appendChild(row);
}

function endGame(resultText, modifier) {
  stopCountdown();
  isInGame = false;
  hasResult = true;
  resultLabel.textContent = resultText;
  appendHistoryRow(resultText === '1.000.000' ? 'GANHOU' : resultText === '0.000.000' ? 'PERDEU' : 'TIMEOUT', modifier);
}

function handleWin() {
  figures.forEach((figure, index) => {
    figure.classList.toggle('state-green', index === winningIndex);
    figure.classList.toggle('state-red', index !== winningIndex);
    figure.disabled = true;
  });
  endGame('1.000.000', 'win');
}

function handleLoss(selectedIndex) {
  figures.forEach((figure, index) => {
    figure.classList.remove('state-green');
    figure.classList.toggle('state-red', index === selectedIndex);
    figure.classList.toggle('state-yellow', index !== selectedIndex);
    figure.disabled = true;
  });
  endGame('0.000.000', 'loss');
}

function handleTimeout() {
  figures.forEach((figure) => {
    figure.classList.remove('state-green', 'state-yellow');
    figure.classList.add('state-red');
    figure.disabled = true;
  });
  endGame('TIMEOUT', 'timeout');
}

function startCountdown() {
  stopCountdown();
  timeLeft = 30;
  updateTimerLabel();
  countdownId = setInterval(() => {
    timeLeft -= 1;
    updateTimerLabel();
    if (timeLeft <= 0) {
      stopCountdown();
      if (!hasResult) {
        handleTimeout();
      }
    }
  }, 1000);
}

function startGame() {
  resetFiguresVisual();
  hasResult = false;
  winningIndex = Math.floor(Math.random() * figures.length);
  isInGame = true;
  resultLabel.textContent = 'EM JOGO';
  startCountdown();
}

figures.forEach((figure) => {
  figure.addEventListener('click', () => {
    if (!isInGame || hasResult) return;
    const selectedIndex = Number(figure.dataset.index);
    if (selectedIndex === winningIndex) {
      handleWin();
    } else {
      handleLoss(selectedIndex);
    }
  });
});

playBtn.addEventListener('click', () => {
  startGame();
});

resetBtn.addEventListener('click', () => {
  stopCountdown();
  isInGame = false;
  hasResult = false;
  winningIndex = null;
  timeLeft = 30;
  updateTimerLabel();
  resultLabel.textContent = '';
  resetFiguresVisual();
  const rows = Array.from(historyBody.querySelectorAll('tr'));
  rows.slice(1).forEach((row) => row.remove());
});

// Inicializa as cores base
resetFiguresVisual();
updateTimerLabel();
