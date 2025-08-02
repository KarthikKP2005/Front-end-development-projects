// Here's the updated JavaScript code with alerts when the time starts and ends:


let hoursInput = document.getElementById('hours');
let minutesInput = document.getElementById('minutes');
let secondsInput = document.getElementById('seconds');
let startBtn = document.getElementById('start-btn');
let stopBtn = document.getElementById('stop-btn');
let resetBtn = document.getElementById('reset-btn');
let timerDisplay = document.getElementById('timer-display');

let hours = 0;
let minutes = 0;
let seconds = 0;
let timerInterval = null;
let alarmSound = new Audio('alarm.mp3'); // add your alarm sound file

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

function startTimer() {
    hours = parseInt(hoursInput.value) || 0;
    minutes = parseInt(minutesInput.value) || 0;
    seconds = parseInt(secondsInput.value) || 0;

    alert(`Timer started! Time remaining: ${hours} hours, ${minutes} minutes, ${seconds} seconds.`);

    timerInterval = setInterval(updateTimer, 1000);
    startBtn.disabled = true;
    stopBtn.disabled = false;
}

function stopTimer() {
    clearInterval(timerInterval);
    alert("Timer stopped!");
    startBtn.disabled = false;
    stopBtn.disabled = true;
}

function resetTimer() {
    clearInterval(timerInterval);
    hours = 0;
    minutes = 0;
    seconds = 0;
    timerDisplay.textContent = '00:00:00';
    hoursInput.value = '';
    minutesInput.value = '';
    secondsInput.value = '';
    startBtn.disabled = false;
    stopBtn.disabled = true;
    alert("Timer reset!");
}

function updateTimer() {
    seconds--;
    if (seconds < 0) {
        minutes--;
        seconds = 59;
    }
    if (minutes < 0) {
        hours--;
        minutes = 59;
    }
    if (hours < 0) {
        clearInterval(timerInterval);
        alarmSound.play();
        alert("Time's up!");
    }

    let hoursStr = hours.toString().padStart(2, '0');
    let minutesStr = minutes.toString().padStart(2, '0');
    let secondsStr = seconds.toString().padStart(2, '0');

    timerDisplay.textContent = `${hoursStr}:${minutesStr}:${secondsStr}`;
}


