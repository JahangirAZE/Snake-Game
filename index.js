const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('snake-logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('high-score');
const downButton = document.getElementById('js-down-button');
const upButton = document.getElementById('js-up-button');
const leftButton = document.getElementById('js-left-button');
const rightButton = document.getElementById('js-right-button');
const startButton = document.getElementById('js-start-button');
const gridSize = 20;
let snake = [{x: 10, y: 10}];
let food = generateFood();
let direction = 'right';
let nextDirection = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let highScore = Number(localStorage.getItem('high-score')) || 0;
function draw() {
  board.innerHTML = '';
  drawSnake();
  drawFood();
  updateScore();
}
function drawSnake() {
  if (gameStarted) {
    snake.forEach(segment => {
      const snakeElement = createGameElement('div', 'snake');
      setPosition(snakeElement, segment);
      board.appendChild(snakeElement);
    });
  }
}
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}
function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}
function generateFood() {
  let x, y;
  do {
    x = Math.floor(Math.random() * gridSize) + 1;
    y = Math.floor(Math.random() * gridSize) + 1;
  } while (snake.some(segment => segment.x === x && segment.y === y)); 
  return { x, y };
}
function move() {
  const head = { ...snake[0] };
  direction = nextDirection;
  switch (direction) {
    case 'right':
      head.x++;
      break;
    case 'left':
      head.x--;
      break;
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    increaseSpeed();
    food = generateFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else snake.pop();
}

function startGame() {
  gameStarted = true;
  instructionText.style.display = 'none';
  logo.style.display = 'none';
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}
function handleButtonOnMobile() {
  startButton.addEventListener('click', () => {
    if (!gameStarted) {
      startGame();
      startButton.textContent = 'Finish';
    } else {
      startButton.textContent = 'Start';
      resetGame();
    }
  });
  downButton.addEventListener('click', () => {
    if (direction !== 'up') nextDirection = 'down';
  });
  upButton.addEventListener('click', () => {
    if (direction !== 'down') nextDirection = 'up';
  });
  rightButton.addEventListener('click', () => {
    if (direction !== 'left') nextDirection = 'right';
  });
  leftButton.addEventListener('click', () => {
    if (direction !== 'right') nextDirection = 'left';
  });
}
function handleKeyPress(event) {
  if ((!gameStarted && (event.code === 'Space' || event.key === ' '))) startGame();
  else { 
    switch (event.key) {
      case 'ArrowUp':
        if (direction !== 'down') nextDirection = 'up';
        break;
      case 'ArrowDown':
        if (direction !== 'up') nextDirection = 'down';
        break;
      case 'ArrowLeft':
        if (direction !== 'right') nextDirection = 'left';
        break;
      case 'ArrowRight':
        if (direction !== 'left') nextDirection = 'right';
        break;
    }
  }
}
document.addEventListener('keydown', handleKeyPress);
document.addEventListener("DOMContentLoaded", () => {
  handleButtonOnMobile();
  highScoreText.textContent = highScore.toString().padStart(3, '0');
});
function increaseSpeed() {
  if (gameSpeedDelay > 150) gameSpeedDelay -= 5;
  else if (gameSpeedDelay > 100) gameSpeedDelay -= 3;
  else if (gameSpeedDelay > 50) gameSpeedDelay -= 2;
  else if (gameSpeedDelay > 25) gameSpeedDelay -= 1;
}
function checkCollision() {
  const head = snake[0];
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) resetGame();
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) resetGame();
  }
}
function resetGame() {
  updateHighScore();
  updateScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  gameSpeedDelay = 200;
}
function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, '0');
}
function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, '0');
    localStorage.setItem('high-score', highScore.toString());
  }
}
function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = 'block';
  logo.style.display = 'block';
  board.innerHTML = '';
}