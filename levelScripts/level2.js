const nbStars = 1;

const startGame = () => {
    for (let y = 0; y < size; y++) {
    const line = [];
        for (let x = 0; x < size; x++) {
            const cell = document.createElement("div");
            if(y === 24 && x ===0){
                cell.classList.add("start");
            } else if(y===24 && x===49){
                cell.classList.add("end");
            }
            else if (y === 25) {
                cell.classList.add("ground");
            } else {
                cell.classList.add("cell");
            }
            game.appendChild(cell);
            line.push(cell);
        }
        cells.push(line);
    }
    cells[playerY][playerX].classList.add("player");
}

startGame();


update(rotation);

