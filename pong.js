// Pong Game

const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game objects
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 12;
const PLAYER_X = 20;
const AI_X = canvas.width - PLAYER_X - PADDLE_WIDTH;
const PADDLE_COLOR = "#fff";
const BALL_COLOR = "#fff";
const MIDLINE_COLOR = "#666";
const SCORE_FONT = "32px Arial";

let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = (Math.random() * 4 + 2) * (Math.random() > 0.5 ? 1 : -1);

let playerScore = 0;
let aiScore = 0;
const WIN_SCORE = 7;
let isGameOver = false;

// Draw midline
function drawMidline() {
  ctx.strokeStyle = MIDLINE_COLOR;
  ctx.lineWidth = 4;
  ctx.setLineDash([18, 16]);
  ctx.beginPath();
  ctx.moveTo(canvas.width/2, 0);
  ctx.lineTo(canvas.width/2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

// Draw paddle
function drawPaddle(x, y) {
  ctx.fillStyle = PADDLE_COLOR;
  ctx.fillRect(x, y, PADDLE_WIDTH, PADDLE_HEIGHT);
}

// Draw ball
function drawBall(x, y) {
  ctx.fillStyle = BALL_COLOR;
  ctx.fillRect(x, y, BALL_SIZE, BALL_SIZE);
}

// Draw score
function drawScore() {
  ctx.font = SCORE_FONT;
  ctx.fillStyle = "#fff";
  ctx.fillText(playerScore, canvas.width/4, 50);
  ctx.fillText(aiScore, 3*canvas.width/4, 50);
}

// Reset ball to center
function resetBall() {
  ballX = canvas.width / 2 - BALL_SIZE / 2;
  ballY = canvas.height / 2 - BALL_SIZE / 2;
  ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
  ballSpeedY = (Math.random() * 4 + 2) * (Math.random() > 0.5 ? 1 : -1);
}

// AI paddle movement
function moveAI() {
  let aiCenter = aiY + PADDLE_HEIGHT / 2;
  if (aiCenter < ballY + BALL_SIZE / 2 - 15) {
    aiY += 5;
  } else if (aiCenter > ballY + BALL_SIZE / 2 + 15) {
    aiY -= 5;
  }
  // Clamp AI paddle to canvas
  aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

// Handle collisions
function checkCollisions() {
  // Top and bottom wall
  if (ballY <= 0) {
    ballY = 0;
    ballSpeedY = -ballSpeedY;
  }
  if (ballY + BALL_SIZE >= canvas.height) {
    ballY = canvas.height - BALL_SIZE;
    ballSpeedY = -ballSpeedY;
  }

  // Player paddle
  if (
    ballX <= PLAYER_X + PADDLE_WIDTH &&
    ballY + BALL_SIZE >= playerY &&
    ballY <= playerY + PADDLE_HEIGHT
  ) {
    ballX = PLAYER_X + PADDLE_WIDTH;
    ballSpeedX = -ballSpeedX;
    // Add some random angle
    ballSpeedY += (Math.random() - 0.5) * 4;
  }
  // AI paddle
  else if (
    ballX + BALL_SIZE >= AI_X &&
    ballY + BALL_SIZE >= aiY &&
    ballY <= aiY + PADDLE_HEIGHT
  ) {
    ballX = AI_X - BALL_SIZE;
    ballSpeedX = -ballSpeedX;
    ballSpeedY += (Math.random() - 0.5) * 4;
  }

  // Scoring
  if (ballX < 0) {
    aiScore += 1;
    resetBall();
  }
  if (ballX > canvas.width - BALL_SIZE) {
    playerScore += 1;
    resetBall();
  }
}

// Game over screen
function drawGameOver() {
  ctx.font = "48px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText(
    playerScore === WIN_SCORE ? "You Win!" : "AI Wins!",
    canvas.width / 2 - 120,
    canvas.height / 2
  );
  ctx.font = "24px Arial";
  ctx.fillText("Refresh page to play again", canvas.width / 2 - 140, canvas.height / 2 + 40);
}

// Main draw function
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMidline();
  drawPaddle(PLAYER_X, playerY);
  drawPaddle(AI_X, aiY);
  drawBall(ballX, ballY);
  drawScore();

  if (isGameOver) {
    drawGameOver();
  }
}

// Game update loop
function update() {
  if (isGameOver) return;

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  moveAI();
  checkCollisions();

  if (playerScore === WIN_SCORE || aiScore === WIN_SCORE) {
    isGameOver = true;
  }
}

// Mouse movement control for player paddle
canvas.addEventListener("mousemove", function (evt) {
  const rect = canvas.getBoundingClientRect();
  const mouseY = evt.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  // Clamp to canvas
  playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Main loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();