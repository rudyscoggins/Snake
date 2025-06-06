const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20; // 20x20 grid cells for 400x400 canvas
let snake = [{x: 9, y: 9}];
let direction = {x: 0, y: -1}; // start moving up
let food = randomPosition();
let gameOver = false;
let speed = 200; // ms per frame

function randomPosition() {
    return {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
}

function drawCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * gridSize, y * gridSize, gridSize - 1, gridSize - 1);
}

function update() {
    if (gameOver) return;

    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

    // check for wall or self collision
    if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize || collision(head)) {
        gameOver = true;
        alert('Game Over!');
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = randomPosition();
    } else {
        snake.pop();
    }

    draw();
}

function collision(pos) {
    return snake.some(segment => segment.x === pos.x && segment.y === pos.y);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.forEach(segment => drawCell(segment.x, segment.y, 'lime'));
    drawCell(food.x, food.y, 'red');
}

function changeDirection(newDir) {
    if (Math.abs(newDir.x) === Math.abs(direction.x) && Math.abs(newDir.y) === Math.abs(direction.y)) {
        return; // prevent reversing
    }
    direction = newDir;
}

// keyboard controls
window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            changeDirection({x:0, y:-1});
            break;
        case 'ArrowDown':
            changeDirection({x:0, y:1});
            break;
        case 'ArrowLeft':
            changeDirection({x:-1, y:0});
            break;
        case 'ArrowRight':
            changeDirection({x:1, y:0});
            break;
    }
});

// touch controls via buttons
function setupControls() {
    document.getElementById('up').addEventListener('click', () => changeDirection({x:0, y:-1}));
    document.getElementById('down').addEventListener('click', () => changeDirection({x:0, y:1}));
    document.getElementById('left').addEventListener('click', () => changeDirection({x:-1, y:0}));
    document.getElementById('right').addEventListener('click', () => changeDirection({x:1, y:0}));
}

setupControls();
setInterval(update, speed);
draw();
