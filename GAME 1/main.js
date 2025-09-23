const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

// Ensure canvas is properly sized
function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log('Canvas initialized:', canvas.width, 'x', canvas.height);
}

initCanvas();
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");
let isPaused = false;
const targetScore = 10;
const resultModal = document.getElementById('resultModal');
const resultText = document.getElementById('resultText');

function openResult(text){
    if(!resultModal) return;
    resultText.textContent = text;
    resultModal.classList.add('open');
    resultModal.setAttribute('aria-hidden','false');
}
//test
function closeResult(){
    if(!resultModal) return;
    resultModal.classList.remove('open');
    resultModal.setAttribute('aria-hidden','true');
}
resultModal?.addEventListener('click', closeResult);

const paddleWidth = 18,
    paddleHeight = 120,
    paddleSpeed = 5,
    ballRadius = 12,
    initialBallSpeed = 8,
    maxBallSpeed = 30,
    netWidth = 5,
    netColor = "Gray";


// Draw net on canvas
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(canvas.width / 2 - netWidth / 2, i, netWidth, 10, netColor);
    }
}

// Draw rectangle on canvas
function drawRect(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

// Draw a circle on canvas
function drawCircle(x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

// Draw text on canvas
function drawText(text, x, y, color, fontSize = 60, fontWeight = 'bold', font = "Courier New") {
    context.fillStyle = color;
    context.font = `${fontWeight} ${fontSize}px ${font}`;
    context.textAlign = "center";
    context.fillText(text, x, y);
}

// Create a paddle object
function createPaddle(x, y, width, height, color) {
    return { x, y, width, height, color, score: 0 };
}

// Create a ball object
function createBall(x, y, radius, velocityX, velocityY, color) {
    return { x, y, radius, velocityX, velocityY, color, speed: initialBallSpeed };
}

// Define user and computer paddle objects
const user = createPaddle(0, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, "WHITE");

const com = createPaddle(canvas.width - paddleWidth, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, "WHITE");

// Define ball object
const ball = createBall(canvas.width / 2, canvas.height / 2, ballRadius, initialBallSpeed, initialBallSpeed, "WHITE");

// Clamp a paddle within the canvas bounds
function clampPaddle(paddle) {
    if (paddle.y < 0) paddle.y = 0;
    if (paddle.y + paddle.height > canvas.height) paddle.y = canvas.height - paddle.height;
}

// Update user paddle position based on mouse movement
canvas.addEventListener('mousemove', movePaddle);

function movePaddle(event) {
    const rect = canvas.getBoundingClientRect();
    user.y = event.clientY - rect.top - user.height / 2;
    clampPaddle(user);
}

// Touch controls for mobile
function handleTouch(event) {
    event.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0] || event.changedTouches[0];
    if (!touch) return;
    user.y = touch.clientY - rect.top - user.height / 2;
    clampPaddle(user);
}
canvas.addEventListener('touchstart', handleTouch, { passive: false });
canvas.addEventListener('touchmove', handleTouch, { passive: false });

// Pause/Resume controls
function togglePause(){
    isPaused = !isPaused;
    if (pauseBtn){
        pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
        pauseBtn.setAttribute('aria-pressed', isPaused ? 'true' : 'false');
    }
}
if (pauseBtn){
    pauseBtn.addEventListener('click', togglePause);
}
window.addEventListener('keydown', function(e){
    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape'){
        togglePause();
    }
});

// Restart logic
function restartGame(){
    // Reset scores
    user.score = 0;
    com.score = 0;

    // Center paddles
    user.x = 0;
    user.y = canvas.height / 2 - user.height / 2;
    com.x = canvas.width - com.width;
    com.y = canvas.height / 2 - com.height / 2;

    // Reset ball state
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = initialBallSpeed;
    ball.velocityX = initialBallSpeed;
    ball.velocityY = initialBallSpeed;

    // Unpause
    if (isPaused){
        togglePause();
    }
}
if (restartBtn){
    restartBtn.addEventListener('click', restartGame);
}
window.addEventListener('keydown', function(e){
    if (e.key === 'r' || e.key === 'R'){
        restartGame();
    }
});

// Resize canvas on window/orientation changes while preserving positions
function resizeGame(preservePositions = true) {
    const oldWidth = canvas.width;
    const oldHeight = canvas.height;
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    canvas.width = newWidth;
    canvas.height = newHeight;

    if (preservePositions && oldWidth > 0 && oldHeight > 0) {
        const scaleX = newWidth / oldWidth;
        const scaleY = newHeight / oldHeight;

        // Scale entities
        user.y *= scaleY;
        com.y *= scaleY;
        ball.x *= scaleX;
        ball.y *= scaleY;
    } else {
        // Center everything on first layout
        user.y = canvas.height / 2 - user.height / 2;
        com.y = canvas.height / 2 - com.height / 2;
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
    }

    // Keep computer paddle on the right edge
    com.x = canvas.width - com.width;

    clampPaddle(user);
    clampPaddle(com);
}

window.addEventListener('resize', function () { resizeGame(true); });
window.addEventListener('orientationchange', function () { resizeGame(true); });

// Check for collision between ball and paddle
function collision(b, p) {
    return (
        b.x + b.radius > p.x && b.x - b.radius < p.x + p.width && b.y + b.radius > p.y && b.y - b.radius < p.y + p.height
    );
}

// Reset ball position and velocity
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = Math.random() * (canvas.height - ball.radius * 2) + ball.radius;
    ball.velocityX = -ball.velocityX;
    ball.speed = initialBallSpeed;
}

// Update game logic
function update() {
    // Check for score and reset ball if necessary
    if (ball.x - ball.radius < 0) {
        com.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        resetBall();
    }

    // End conditions at 10 points
    if (user.score >= targetScore) {
        isPaused = true;
        openResult('You Win! / فزت!');
        return;
    }
    if (com.score >= targetScore) {
        isPaused = true;
        openResult('You Lose! / خسرت');
        return;
    }

    // Update ball position
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Update computer paddle position based on ball position
    com.y += (ball.y - (com.y + com.height / 2)) * 0.1;

    // Top and bottom walls
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
    }

    // Determine which paddle is begin hit by the ball and handle collision
    let player = ball.x + ball.radius < canvas.width / 2 ? user : com;
    if (collision(ball, player)) {
        const collidePoint = ball.y - (player.y + player.height / 2);
        const collisionAngle = (Math.PI / 4) * (collidePoint / (player.height / 2));
        const direction = ball.x + ball.radius < canvas.width / 2 ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(collisionAngle);
        ball.velocityY = ball.speed * Math.sin(collisionAngle);

        // Increase ball speed and limit to max speed
        ball.speed += 0.2;
        if (ball.speed > maxBallSpeed) {
            ball.speed = maxBallSpeed;
        }
    }
}

// Render game on canvas
function render() {
    // Clear canvas with black screen
    drawRect(0, 0, canvas.width, canvas.height, "BLACK");
    drawNet();

    // Draw scores
    drawText(user.score, canvas.width / 4, canvas.height / 2, "GRAY", 120, 'bold');
    drawText(com.score, (3 * canvas.width) / 4, canvas.height / 2, "GRAY", 120, 'bold');

    // Draw paddles
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    // Draw ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);

    // Debug: Log render calls occasionally
    if (Math.random() < 0.01) {
        console.log('Render called, canvas size:', canvas.width, 'x', canvas.height);
    }
}


// Run game loop
function gameLoop() {
    if (!isPaused){
        update();
    }
    render();
    if (isPaused){
        context.fillStyle = "rgba(0,0,0,0.35)";
        context.fillRect(0, 0, canvas.width, canvas.height);
        drawText('PAUSED', canvas.width / 2, canvas.height / 2, 'WHITE', 80, 'bold');
    }
}

// Set gameLoop to run at 60 frame per second
const framePerSec = 60;
resizeGame(false);

// Add debugging
console.log('Starting game loop...');
console.log('Canvas element:', canvas);
console.log('Context:', context);

setInterval(gameLoop, 1000 / framePerSec);