let timerInterval = null;
let seconds = 0;
let isRunning = false;

const chronometerDisplay = document.getElementById("chronometer");
const toggleButton = document.getElementById("toggle-timer");

const updateDisplay = () => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    chronometerDisplay.textContent = `${mins}:${secs}`;
};

const startTimer = () => {
    timerInterval = setInterval(() => {
        seconds++;
        updateDisplay();
    }, 1000);
};

const stopTimer = () => {
    clearInterval(timerInterval);
};


