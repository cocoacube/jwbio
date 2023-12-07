const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

let boxSize = 20;
let bodyBoxSize = 15; // Choose a size for the body segments
let snakeBoxSize = 20;
const canvasSize = canvas.width;
const totalBoxes = canvasSize / boxSize;

let snake = [];
snake = [{ x: 10 * snakeBoxSize, y: 10 * snakeBoxSize }];

snake[0] = { x: 10 * snakeBoxSize, y: 10 * snakeBoxSize };

let fruit = {
    x: Math.floor(Math.random() * totalBoxes) * boxSize,
    y: Math.floor(Math.random() * totalBoxes) * boxSize
};

let score = 0;
let d;

document.addEventListener("keydown", direction);


let headImage = new Image();
headImage.src = "rabbit.png"; // default to rabbit

function changeHead() {
    let choice = document.getElementById("headChoice").value;
    headImage.src = choice;
}


function direction(event) {
    if (event.keyCode == 37 && d != "RIGHT") d = "LEFT";
    if (event.keyCode == 38 && d != "DOWN") d = "UP";
    if (event.keyCode == 39 && d != "LEFT") d = "RIGHT";
    if (event.keyCode == 40 && d != "UP") d = "DOWN";
}

document.getElementById("restartButton").addEventListener("click", restartGame);

function draw() {

    console.log("Snake:", JSON.stringify(snake));

    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    let choice = document.getElementById("headChoice").value;
    headImage.src = choice;

    if (choice === "god.png" || choice === "goddess.png") {
        snakeBoxSize = 60;
    } else {
        snakeBoxSize = 40;
    }

    // for (let i = 0; i < snake.length; i++) {
    //     // context.fillStyle = (i == 0) ? "green" : "white";
    //     // context.fillRect(snake[i].x, snake[i].y, boxSize, boxSize);

    //     if (i == 0) {
    //         context.drawImage(headImage, snake[i].x, snake[i].y, snakeBoxSize, snakeBoxSize);
    //     } else {
    //         context.fillStyle = "white";
    //         context.fillRect(snake[i].x, snake[i].y, snakeBoxSize, snakeBoxSize);
    //     }


    //     context.strokeStyle = "white";
    //     context.strokeRect(snake[i].x, snake[i].y, snakeBoxSize, snakeBoxSize);
    // }

    for (let i = 0; i < snake.length; i++) {
        if (i == 0) {
            context.drawImage(headImage, snake[i].x, snake[i].y, snakeBoxSize, snakeBoxSize);
        } else {
            context.fillStyle = "white";
            context.fillRect(snake[i].x, snake[i].y, bodyBoxSize, bodyBoxSize);
        }

        context.strokeStyle = "white";
        context.strokeRect(snake[i].x, snake[i].y, (i == 0) ? snakeBoxSize : bodyBoxSize, (i == 0) ? snakeBoxSize : bodyBoxSize);
    }

    context.fillStyle = "red";
    context.fillRect(fruit.x, fruit.y, boxSize, boxSize);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // if (d == "LEFT") snakeX -= snakeBoxSize;
    // if (d == "UP") snakeY -= snakeBoxSize;
    // if (d == "RIGHT") snakeX += snakeBoxSize;
    // if (d == "DOWN") snakeY += snakeBoxSize;
    if (d == "LEFT") snakeX -= bodyBoxSize;
    if (d == "UP") snakeY -= bodyBoxSize;
    if (d == "RIGHT") snakeX += bodyBoxSize;
    if (d == "DOWN") snakeY += bodyBoxSize;

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    if ( 
        snakeX < fruit.x + boxSize &&
        snakeX + snakeBoxSize > fruit.x &&
        snakeY < fruit.y + boxSize &&
        snakeY + snakeBoxSize > fruit.y
    ) {
        score++;
        fruit = {
            x: Math.floor(Math.random() * 20) * boxSize,
            y: Math.floor(Math.random() * 20) * boxSize
        };
    } else {
        snake.pop();
    }
    
    // if (snakeX == fruit.x && snakeY == fruit.y) {
    //     score++;
    //     fruit = {
    //         x: Math.floor(Math.random() * totalBoxes) * boxSize,
    //         y: Math.floor(Math.random() * totalBoxes) * boxSize
    //     };
    // } else {
    //     snake.pop();
    // }

    function collision(head, array) {
        for (let i = 0; i < array.length; i++) {
            if (head.x == array[i].x && head.y == array[i].y) return true;
        }
        return false;
    }

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvasSize || snakeY >= canvasSize || collision(newHead, snake)) {
        gameOver();
        clearInterval(game);
        checkAndUpdateHighScore(score);

    }

    snake.unshift(newHead);

    context.fillStyle = "black";
    context.font = "20px Arial";
    context.fillText("Score: " + score, boxSize, boxSize);

    let highScore = localStorage.getItem("highScore") || 0;

    context.fillStyle = "black";
    context.font = "20px Arial";
    context.fillText("Score: " + score, boxSize, boxSize);
    context.fillText("High Score: " + highScore, boxSize, 2 * boxSize);
}

function checkAndUpdateHighScore(newScore) {
    let highScore = localStorage.getItem("highScore");

    // If there's no high score or the new score is higher, update and return the new high score.
    if (!highScore || newScore > highScore) {
        localStorage.setItem("highScore", newScore);
        return newScore;
    }

    // Otherwise, return the existing high score.
    return highScore;
}

function direction(event) {
    let key = event.key;
    if (key == 'ArrowLeft' && d != "RIGHT") d = "LEFT";
    if (key == 'ArrowUp' && d != "DOWN") d = "UP";
    if (key == 'ArrowRight' && d != "LEFT") d = "RIGHT";
    if (key == 'ArrowDown' && d != "UP") d = "DOWN";
}

function gameOver() {
    clearInterval(game); // Stop the game
    document.getElementById("restartButton").style.display = "block"; // Show the restart button
}

function restartGame() {
    console.log("Restarting game...");

    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;

    snake = [{ x: centerX - (snakeBoxSize / 2), y: centerY - (snakeBoxSize / 2) }];
    d = null; 
    score = 0;
    fruit = {
        x: Math.floor(Math.random() * totalBoxes) * boxSize,
        y: Math.floor(Math.random() * totalBoxes) * boxSize
    };
    
    document.getElementById("restartButton").style.display = "none";
    
    // Ensure any previous game loop is cleared before starting a new one.
    if(game) {
        clearInterval(game);
    }
    
    game = setInterval(draw, 150);
}


function resetGame() {
    // Reset snake to initial state
    snake = [{ x: 10 * boxSize, y: 10 * boxSize }];
    score = 0;
    fruit = {
        x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
        y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize
    };
}


let game = setInterval(draw, 150);
