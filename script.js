const gameboard = document.querySelector('[data-gameboard]');
const cell = gameboard.querySelector('[data-gameboard-cell]');
const form = document.getElementById('form');
const playButton = document.querySelector('[data-button-play]');
const buildButton = document.querySelector('[data-button-build]')

let columnCount, rowHeight, cellSize;
let shifts;
let gameState;
let timer;

prepare();

playButton.addEventListener('click', () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  } else {
    timer = setInterval(tick, 400);
  }
})

buildButton.addEventListener('click', () => {
  if (doesRequireRestart()) {
    prepare();
  }
})

gameboard.addEventListener('click', (event) => {

  const i = [...gameboard.children].indexOf(event.target);
  gameState[i] = 1 - gameState[i];

  render();
})

function tick() {
  const nextState = [];

  for (let i = 0; i < gameState.length; i++) {
    const count = shifts.map(shift => gameState[i + shift])
      .filter(Boolean)
      .reduce((sum, num) => sum + num, 0)

    nextState[i] = Number(count == 3 || count == 2 && gameState[i])
  }

  gameState.splice(0, gameState.length, ...nextState);
  render();
}

function render() {
  gameboard.style.setProperty('--cell-size', cellSize + 'px');
  gameboard.style.setProperty('--board-width', cellSize * columnCount + 'px');
  gameboard.style.setProperty('--board-height', cellSize * rowHeight + 'px');

  gameState.forEach((item, index) => {
    gameboard.children[index].classList.toggle('is-alive', item == 1);
  })
}

function buildGameboard() {
  const cellCount = form.width.value * form.height.value;
  const cells = [cell];

  for (let i = 1; i < cellCount; i++) {
    cells.push(cell.cloneNode());
  }

  gameboard.replaceChildren(...cells);

  return Array(cellCount).fill(0);
}

function prepare() {
  cellSize = +form.cellSize.value;
  columnCount = +form.width.value;
  rowHeight = +form.height.value;
  shifts = [-columnCount - 1, -columnCount, -columnCount + 1, -1, 1, columnCount - 1, columnCount, columnCount + 1];

  gameState = buildGameboard();
  render();
}

function doesRequireRestart() {
  return !(
    cellSize == form.cellSize.value &&
    columnCount == form.width.value &&
    rowHeight == form.height.value
  );
}