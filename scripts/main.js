const game = document.getElementById("game");
const size = 50;
const cells = [];

let playerX = 0;
let playerY = 24;

let rotation = 1

let canMove = true;
let isJumping = false;
let go = false;
let finish = false;
let dead = false;

const moveDelay = 100;
const jumpDelay = 300;
const fallDelay = 50;

const getCellColor = (x,y) => {
    const cell = cells[y][x];
    const style = window.getComputedStyle(cell);
    return style.backgroundColor;
}

const update = (rotation) => {
    if(playerX === 49 && playerY === 24){
        stopTimer();
    }
    const currentColor = getCellColor(playerX, playerY);
    if(currentColor !== "rgb(255, 0, 0)"){
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                cells[y][x].classList.remove("player");
            }
        }
        if(rotation === 1){
            cells[playerY][playerX].classList.add("player");
        }
        else if(rotation === 2){
            cells[playerY][playerX].classList.add("player", "rotate-2");
        }
        else if(rotation === 3){
            cells[playerY][playerX].classList.add("player", "rotate-3");
        }
        else if(rotation === 4){
            cells[playerY][playerX].classList.add("player", "rotate-4");
        }
        cells[playerY][playerX].scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center"
        });
    } else {
        playerY--;
    }
}


document.addEventListener("keydown", function (e) {
    const key = e.key.toLowerCase();
    if(!go){
        go = true;
        startTimer();
        document.getElementById("chronometer-container").style.display = "flex";
    }
    if (key === "z" && playerY > 0 && !isJumping) {
        const aboveColor = getCellColor(playerX, playerY - 1);
        if (aboveColor !== "rgb(255, 0, 0)") {
            isJumping = true;
            playerY--;
            update(rotation);

            setTimeout(() => {
                const aboveColor = getCellColor(playerX, playerY + 1);
                if (aboveColor !== "rgb(255, 0, 0)") {
                    playerY++;
                }
                update(rotation);
                isJumping = false;
            }, jumpDelay);
        }
        return;
    }
    if (!canMove) return;
    canMove = false;

    if (key === "s" && playerY < size - 1) {
        const belowColor = getCellColor(playerX, playerY + 1);
        if (belowColor !== "rgb(255, 0, 0)") {
            playerY++;
        }
    } else if (key === "q" && playerX > 0) {
        const leftColor = getCellColor(playerX - 1, playerY);
        if (leftColor !== "rgb(255, 0, 0)") {
            playerX--;
            changeLeftRotation();
            fall();
        }
    } else if (key === "d" && playerX < size - 1) {
        const rightColor = getCellColor(playerX + 1, playerY);
        if (rightColor !== "rgb(255, 0, 0)") {
            playerX++;
            changeRightRotation();
            fall();
        }
    }

    update(rotation);

    setTimeout(() => {
        canMove = true;
    }, moveDelay);
});

const fall = () => {
    const nextColor = getCellColor(playerX, playerY + 1);
    if (nextColor !== "rgb(255, 0, 0)") {
        setTimeout(() => {
            playerY++;
            update(rotation);
            fall();
        }, fallDelay);
    }
};


const changeRightRotation = () => {
    if(rotation<4){
        rotation++;
    }
    else {
        rotation = 1
    }
}

const changeLeftRotation = () => {
    if(rotation>1){
        rotation--;
    }
    else {
        rotation = 4
    }
}