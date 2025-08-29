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
let inAnimation = false;

const moveDelay = 100;
const jumpDelay = 300;
const fallDelay = 200;
let stars = 0;
let fallBonus = 10;
const loseDelay = 1000;

let enemyX = 10;       // position initiale X (par exemple)
let enemyY = 24;       // position Y fixe (par exemple sur la même ligne que le joueur)
let enemyDirection = 1; // 1 = déplacement vers la droite, -1 vers la gauche
let enemySteps = 0;    // compteur de déplacements dans une direction
const enemyMaxSteps = 3; // nombre de cases max dans une direction


const getCellColor = (x,y) => {
    const cell = cells[y][x];
    const style = window.getComputedStyle(cell);
    return style.backgroundColor;
}
const removePlayer = () => {
    for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                cells[y][x].classList.remove("player","enemy");
            }
        }
}
const update = (rotation) => {
    cells[enemyY][enemyX].classList.add("enemy");
    cell = cells[playerY][playerX]
    if(cell.classList.contains("star")){
        stars = stars +1;
        triggerEffect();
        cells[playerY][playerX].classList.remove("star");
        cells[playerY][playerX].classList.add("cell");
    }
    if(playerX === 49 && playerY === 24){
        clearInterval(enemyMoveInterval);
        stopTimer();
        finish = true;
        removePlayer();
        cells[playerY][playerX].classList.add("player");
        cells[enemyY][enemyX].classList.add("enemy");
        setTimeout(() => {
            const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
            const secs = String(seconds % 60).padStart(2, "0");
            document.getElementById("result").textContent += "YOU WIN !";
            document.getElementById("stars").textContent = `STARS : ${stars}/${nbStars}`;
            document.getElementById("time").textContent += `${mins}:${secs}`;
            document.getElementById("rank").textContent += getRank(mins,secs);
            endGame();
        }, loseDelay);
    }
    const currentColor = getCellColor(playerX, playerY);
    if(currentColor == "rgb(99, 7, 7)"){
        clearInterval(enemyMoveInterval);
        stopTimer();
        dead = true;
        removePlayer();
        cells[playerY][playerX].classList.add("player", "dead");
        cells[enemyY][enemyX].classList.add("enemy");
        setTimeout(() => {
            const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
            const secs = String(seconds % 60).padStart(2, "0");
            document.getElementById("result").textContent += "YOU LOSE !";
            document.getElementById("stars").textContent = `STARS : ${stars}/${nbStars}`;
            document.getElementById("time").textContent += `${mins}:${secs}`;
            document.getElementById("rank").textContent += "E";
            endGame();
        }, loseDelay);
    }
    else if(currentColor !== "rgb(255, 0, 0)"){
        removePlayer();
        cells[enemyY][enemyX].classList.add("enemy");
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
    document.getElementById("starsTitle").textContent = `STARS : ${stars}/${nbStars}`;
}


document.addEventListener("keydown", function (e) {
    if(!dead && !finish && !inAnimation){
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
                playerY--;
                update(rotation);

                setTimeout(() => {
                const aboveColor = getCellColor(playerX, playerY + 1);
                    if (aboveColor !== "rgb(255, 0, 0)") {
                        playerY+=2;
                        
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
                fall(fallBonus);
            }
        } else if (key === "d" && playerX < size - 1) {
            const rightColor = getCellColor(playerX + 1, playerY);
            if (rightColor !== "rgb(255, 0, 0)") {
                playerX++;
                changeRightRotation();
                fall(fallBonus);
            }
        }

        update(rotation);

        setTimeout(() => {
            canMove = true;
        }, moveDelay);
    }
});

const fall = (fb) => {
    console.log(fb);
    const nextColor = getCellColor(playerX, playerY + 1);
    if (nextColor !== "rgb(255, 0, 0)") {
        setTimeout(() => {
            playerY++;
            update(rotation);
            if(fb+7<149){
                fb = fb + 7
            }
            fall(fb);
        }, fallDelay-fb);
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

const endGame = () => {
    document.getElementById("resume").style.visibility = "visible";
};

const getRank = (min,sec) =>{
    if(min == 0 && sec < 30){
        return "S";
    }else if(min == 0){
        return "A";
    } else if(min == 1) {
        return "B";
    } if(min == 2){
        return "C";
    } else {
        return "D";
    }
}

const triggerEffect = () => {
    const cell = cells[playerY][playerX];
    cell.classList.add("effect");
    inAnimation = true;
    setTimeout(() => {
        cell.classList.remove("effect");
        inAnimation = false
    }, 500);
    
}

function moveEnemy() {
    // Avance ou recule selon enemyDirection
    enemyX += enemyDirection;
    enemySteps++;

    // Si on a fait 3 pas dans cette direction, on inverse
    if (enemySteps >= enemyMaxSteps) {
        enemyDirection *= -1; // inverse la direction
        enemySteps = 0;
    }

    // Garde l’ennemi dans la grille (optionnel)
    if (enemyX < 0) {
        enemyX = 0;
        enemyDirection = 1;
        enemySteps = 0;
    } else if (enemyX >= size) {
        enemyX = size - 1;
        enemyDirection = -1;
        enemySteps = 0;
    }

    // Mise à jour visuelle
    update(rotation);
}

const enemyMoveInterval = setInterval(moveEnemy, 1000); // déplace l’ennemi toutes les secondes

