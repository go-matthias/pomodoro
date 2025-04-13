let totalSeconds = 25 * 60;
let timeLeft = totalSeconds;
let timer = null;
let currentMode = 'focus';

const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const timeDisplay = document.querySelector('.time-display');
const progressRing = document.querySelector('.progress-ring__circle');
const focusBtn = document.querySelector('[data-mode="focus"]');
const breakBtn = document.querySelector('[data-mode="break"]');
const timerElement = document.querySelector('.timer');

// Calculate the progress ring circumference
const radius = 136;
const circumference = radius * 2 * Math.PI;
progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
progressRing.style.strokeDashoffset = circumference;

function setProgress(percent) {
    const offset = circumference - (percent / 100 * circumference);
    progressRing.style.strokeDashoffset = offset;
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
    setProgress(progress);
    
    // Adjust animation speed based on time left
    const animationDuration = Math.max(1, Math.min(3, timeLeft / 60));
    timerElement.style.animationDuration = `${animationDuration}s`;
}

function switchMode(mode) {
    currentMode = mode;
    if (mode === 'focus') {
        totalSeconds = 25 * 60;
        focusBtn.classList.add('active');
        breakBtn.classList.remove('active');
        progressRing.style.stroke = 'var(--primary-color)';
    } else {
        totalSeconds = 5 * 60;
        breakBtn.classList.add('active');
        focusBtn.classList.remove('active');
        progressRing.style.stroke = 'var(--success-color)';
    }
    resetTimer();
}

function startTimer() {
    if (timer === null) {
        timer = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft === 0) {
                clearInterval(timer);
                timer = null;
                new Audio('notification.mp3').play().catch(() => {});
                alert(`${currentMode === 'focus' ? 'Focus' : 'Break'} session completed!`);
                resetTimer();
            }
        }, 1000);
        startBtn.textContent = 'Pause';
        startBtn.style.backgroundColor = 'var(--danger-color)';
        timerElement.classList.add('running');
    } else {
        clearInterval(timer);
        timer = null;
        startBtn.textContent = 'Start';
        startBtn.style.backgroundColor = 'var(--primary-color)';
        timerElement.classList.remove('running');
    }
}

function resetTimer() {
    if (timer !== null) {
        clearInterval(timer);
        timer = null;
    }
    timeLeft = totalSeconds;
    updateDisplay();
    startBtn.textContent = 'Start';
    startBtn.style.backgroundColor = 'var(--primary-color)';
    timerElement.classList.remove('running');
}

// Event Listeners
startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
focusBtn.addEventListener('click', () => switchMode('focus'));
breakBtn.addEventListener('click', () => switchMode('break'));

// Initialize the display
updateDisplay();
focusBtn.classList.add('active'); 