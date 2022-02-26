const gameboard = document.querySelector('[data-gameboard]');
const cell = gameboard.querySelector('[data-gameboard-cell]');
const playButton = document.querySelector('[data-button-play]');
const gameboardSize = gameboard.getBoundingClientRect();
const cellSize = cell.getBoundingClientRect();
const cellsInRow = (gameboardSize.width - 1) / cellSize.width;

const shifts = [-41, -40, -39, -1, 1, 39, 40, 41]


let timer
// Структура данных
const gameState = buildGameboard();

// Дефолтный стейт
gameState[100] = 1;

// Правила игры

// ячеек в лдном ряду
// console.log(cellsInRow)

// gameState[i]==0 уже была пустой

function tick()
{
  const nextState = [];
  for (let i = 0; i < gameState.length; i++)
  {
    const count = shifts.map(shift => gameState[i + shift])
      .filter(Boolean)
      .reduce((sum, num) => sum + num, 0)
    nextState[i] = Number(count == 3 || count == 2 && gameState[i])
    // if (count < 2 || count > 3 || count == 2 && gameState[i] == 0)
    // {
    //   nextState[i] = 0;
    // } else
    // {
    //   nextState[i] = 1;
    // }
  }

  gameState.splice(0, gameState.length, ...nextState);
  render();
}


// Добавляем слущатель на кнопку

playButton.addEventListener('click', () =>
{
  if (timer)
  {
    clearInterval(timer);
    timer = null;
  } else
  {
    timer = setInterval(tick, 400);
  }
})




//  Событие по клику пользователя
gameboard.addEventListener('click', (event) =>
{

  const i = [...gameboard.children].indexOf(event.target);
  gameState[i] = 1 - gameState[i]
  // if (gameState[i] == 0)
  // {
  //   gameState[i] = 1;
  // } else
  // {
  //   gameState[i] = 0;

  // }

  render();
})

render();

function render()
{
  gameState.forEach((item, index) =>
  {
    gameboard.children[index].classList.toggle('is-alive', item == 1);
    // if (item == 1)
    // {
    //   gameboard.children[index].classList.add('is-alive');
    // } else
    // {
    //   gameboard.children[index].classList.remove('is-alive');
    // }
  })
}

function buildGameboard()
{
  const gameboardArea = (gameboardSize.height - 1) * (gameboardSize.width - 1);

  const cellArea = cellSize.height * cellSize.width;

  const cellCount = gameboardArea / cellArea;
  for (let i = 1; i < cellCount; i++)
  {
    const cellClone = cell.cloneNode();
    gameboard.appendChild(cellClone);
  }
  return Array(cellCount).fill(0);
}


