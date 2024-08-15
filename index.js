const gameContainer = document.getElementById("gameContainer")
const gameBoard = document.getElementById("gameBoard")
const context = gameBoard.getContext("2d")
const scoreText = document.getElementById("scoreText")
const resetBtn = document.getElementById("resetBtn")
const gameWidth = gameBoard.width
const gameHeight = gameBoard.height
const boardColor = "linen"
const snakeColor = "lightgreen"
const foodColor = "tomato"
const unitSize = 50
const image = new Image(100, 50)
image.src = "Snake-head.png"

let running = false
let win = false
let xVel = unitSize
let yVel = 0
let foodX
let foodY
let score = 0
let snake = [
    { x: unitSize * 3, y: 100 },
    { x: unitSize * 2, y: 100 },
    { x: unitSize, y: 100 }
]
let timeOut

window.addEventListener("keydown", changeDir)
resetBtn.addEventListener("click", restart)

displayLoadingScreen()

function displayLoadingScreen() {
    context.fillStyle = foodColor
    context.fillRect(50, 100, unitSize * 3, unitSize)

    context.fillStyle = snakeColor
    setTimeout(() => {
        context.drawImage(image, 50, 100)
        score += 1
        scoreText.textContent = "Loading... " + score * 4 + "%"
    }, 700);
    setTimeout(() => {
        context.fillRect(50, 100, 100, 50)
        context.drawImage(image, 100, 100)
        score += 1
        scoreText.textContent = "Loading... " + score * 4 + "%"
    }, 1500);
    setTimeout(() => {
        context.fillRect(50, 100, 150, 50)
        context.drawImage(image, 150, 100)
        score += 1
        scoreText.textContent = "Loading... " + score * 4 + "%"
        start()
    }, 2500);
}

function start() {
    clearBoard()
    running = true
    scoreText.textContent = "Loading... " + score * 4 + "%"
    drawSnake()
    createFood()
    drawFood()
    nextTick()
}

function nextTick() {
    if (running) {
        timeOut = setTimeout(() => {
            clearBoard()
            drawFood()
            moveSnake()
            drawSnake()
            checkWin()
            checkGameOver()
            nextTick()
        }, 400)
    }
    else if (!win) {
        displayGameOver()
    }
}

function clearBoard() {
    context.fillStyle = boardColor
    context.fillRect(0, 0, gameWidth, gameHeight)
}

function createFood() {
    function generatePos(min, max) {
        const rand = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize
        return rand
    }

    let empty = true
    do {
        foodX = generatePos(0, gameWidth - unitSize)
        foodY = generatePos(0, gameHeight - unitSize)

        empty = true
        snake.forEach(part => {
            if (part.x == foodX && part.y == foodY) {
                empty = false
            }
        })
    } while (!empty)
}

function drawFood() {
    context.fillStyle = foodColor
    context.fillRect(foodX, foodY, unitSize, unitSize)
}

function moveSnake() {
    const head = { x: snake[0].x + xVel, y: snake[0].y + yVel }
    snake.unshift(head)
    if (head.x == foodX && head.y == foodY) {
        score += 1
        scoreText.textContent = "Loading... " + score * 4 + "%"
        createFood()
    }
    else {
        snake.pop()
    }
}

function drawSnake() {
    context.fillStyle = snakeColor
    const up = (yVel == -unitSize)
    const down = (yVel == unitSize)
    const left = (xVel == -unitSize)
    for (let i = 0; i < snake.length; i += 1) {
        part = snake[i]
        if (i == 0) {
            context.save()
            context.translate(part.x + unitSize / 2, part.y + unitSize / 2)
            switch (true) {
                case (up):
                    context.rotate(-Math.PI / 2)
                    break
                case (down):
                    context.rotate(Math.PI / 2)
                    break
                case (left):
                    context.rotate(Math.PI)
                    break
            }
            context.translate(-25, -25)
            context.drawImage(image, 0, 0)
            context.restore()
            continue
        }
        context.fillRect(part.x, part.y, unitSize, unitSize)
    }
}

function changeDir(event) {
    const keypressed = event.keyCode

    const al = 37
    const au = 38
    const ar = 39
    const ad = 40
    const a = 65
    const w = 87
    const d = 68
    const s = 83

    const up = (yVel == -unitSize)
    const down = (yVel == unitSize)
    const left = (xVel == -unitSize)
    const right = (xVel == unitSize)

    switch (true) {
        case ((keypressed == al || keypressed == a) && !right):
            xVel = -unitSize
            yVel = 0
            break
        case ((keypressed == au || keypressed == w) && !down):
            xVel = 0
            yVel = -unitSize
            break
        case ((keypressed == ar || keypressed == d) && !left):
            xVel = unitSize
            yVel = 0
            break
        case ((keypressed == ad || keypressed == s) && !up):
            xVel = 0
            yVel = unitSize
            break
    }
}

function checkGameOver() {
    switch (true) {
        case (snake[0].x < 0):
            running = false
            break
        case (snake[0].x >= gameWidth):
            running = false
            break
        case (snake[0].y < 0):
            running = false
            break
        case (snake[0].y >= gameHeight):
            running = false
            break
    }

    for (let i = 1; i < snake.length; i += 1) {
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            running = false
        }
    }
}

function displayGameOver() {
    context.fillStyle = "crimson"
    context.font = "2em New Amsterdam"
    context.textAlign = "center"
    context.fillText("404 PAGE NOT FOUND", gameWidth / 2, gameHeight / 2)
}

function checkWin() {
    if (score >= 25){
        running = false
        win = true
        context.fillStyle = "limegreen"
        context.font = "2em New Amsterdam"
        context.textAlign = "center"
        context.fillText("LOADING COMPLETE", gameWidth / 2, gameHeight / 2)
        setTimeout(() => {
            gameContainer.outerHTML = "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/dQw4w9WgXcQ?si=uyJQYaR9u39ZOMgw&amp;controls=0\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay=1; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe>"
        }, 1000);
    }
}

function restart() {
    score = 0
    xVel = unitSize
    yVel = 0
    snake = [
        { x: unitSize * 3, y: 100 },
        { x: unitSize * 2, y: 100 },
        { x: unitSize, y: 100 }
    ]
    clearTimeout(timeOut)
    clearBoard()
    displayLoadingScreen()
}