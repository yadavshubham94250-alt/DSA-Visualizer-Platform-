// globals.js 
// Holds state and global references to avoid CORS module restrictions

const STATE = {
    array: [],
    speed: 500,
    isSorting: false,
    isPaused: false,
    activeView: 'sorting',
    activeAlgo: 'bubble',
    algorithms: {} // populated by modules
};

// Control promises for pausing
let resolver = null;

// Algorithm Registration Helper
function registerAlgorithm(view, id, name, description, timeComplexity, spaceComplexity, logicFn) {
    if (!STATE.algorithms[view]) STATE.algorithms[view] = [];
    STATE.algorithms[view].push({
        id, name, description, timeComplexity, spaceComplexity, logicFn
    });
}
