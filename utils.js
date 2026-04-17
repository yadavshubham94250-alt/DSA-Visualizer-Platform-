// utils.js

async function sleep() {
    return new Promise(resolve => {
        const timeout = setTimeout(() => {
            if (!STATE.isPaused) resolve();
        }, STATE.speed);

        // This allows pausing mechanics
        const checkPause = setInterval(() => {
            if (!STATE.isPaused && resolver) {
                clearInterval(checkPause);
                resolver();
                resolver = null;
            }
            if (!STATE.isSorting) { // If stopped entirely
                clearInterval(checkPause);
                clearTimeout(timeout);
                resolve();
            }
        }, 50);

        if (STATE.isPaused) {
            clearTimeout(timeout);
            resolver = resolve;
        }
    });
}

function generateRandomArray(size = 30, max = 100) {
    let arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * max) + 5);
    }
    return arr;
}

function updateComplexity(time, space) {
    document.getElementById('time-complexity').innerText = time;
    document.getElementById('space-complexity').innerText = space;
}

function updateDescription(desc) {
    document.getElementById('algo-description').innerText = desc;
}
