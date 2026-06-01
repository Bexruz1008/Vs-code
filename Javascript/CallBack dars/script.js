const display = document.getElementById("display");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");

const minutes = 25;
let totalSeconds = minutes * 60;
let timerId = null;

function updateDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    display.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function startTimer() {
    if (timerId) {
        return;
    }

    timerId = setInterval(() => {
        if (totalSeconds === 0) {
            stopTimer();
            return;
        }

        totalSeconds--;
        updateDisplay();
        display.style.color = "green"
    }, 1000);
}

function stopTimer() {
    clearInterval(timerId);
    timerId = null;
    display.style.color = "red"
}

function resetTimer() {
    stopTimer();
    totalSeconds = minutes * 60;
    updateDisplay();
    display.style.color = "white"
}

startBtn.addEventListener("click", startTimer);
stopBtn.addEventListener("click", stopTimer);
resetBtn.addEventListener("click", resetTimer);

updateDisplay();
