// app.js

document.addEventListener('DOMContentLoaded', () => {
    const sidebarItems = document.querySelectorAll('.nav-links li');
    const viewPanels = document.querySelectorAll('.view-panel');
    const algoSelect = document.getElementById('algo-select');
    const btnGenerate = document.getElementById('btn-generate');
    const btnSort = document.getElementById('btn-sort');
    const btnPause = document.getElementById('btn-pause');
    const speedSlider = document.getElementById('speed-slider');

    // Init speed
    STATE.speed = 1010 - parseInt(speedSlider.value); // 10 to 1000, invert to make right-side faster

    speedSlider.addEventListener('input', (e) => {
        STATE.speed = 1010 - parseInt(e.target.value);
    });

    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            if (STATE.isSorting) return; // Disallow view change while running

            // Update UI
            sidebarItems.forEach(li => li.classList.remove('active'));
            item.classList.add('active');

            const view = item.getAttribute('data-view');
            STATE.activeView = view;

            viewPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id.includes(view) || (view === 'sorting' && panel.id === 'bars-container') || (view === 'searching' && panel.id === 'bars-container')) {
                    panel.classList.add('active');
                }
            });

            populateAlgorithms(view);
            handleViewChange(view);
        });
    });

    algoSelect.addEventListener('change', (e) => {
        STATE.activeAlgo = e.target.value;
        const algoObj = STATE.algorithms[STATE.activeView].find(a => a.id === STATE.activeAlgo);
        if (algoObj) {
            updateComplexity(algoObj.timeComplexity, algoObj.spaceComplexity);
            updateDescription(algoObj.description);
        }
    });

    function populateAlgorithms(view) {
        algoSelect.innerHTML = '';
        if (STATE.algorithms[view]) {
            STATE.algorithms[view].forEach(algo => {
                const opt = document.createElement('option');
                opt.value = algo.id;
                opt.innerText = algo.name;
                algoSelect.appendChild(opt);
            });
            STATE.activeAlgo = STATE.algorithms[view][0].id;
            updateComplexity(STATE.algorithms[view][0].timeComplexity, STATE.algorithms[view][0].spaceComplexity);
            updateDescription(STATE.algorithms[view][0].description);
        }
    }

    // Specific handlers for views
    function handleViewChange(view) {
        STATE.isPaused = false;
        btnPause.innerText = 'Pause';

        if (view === 'sorting' || view === 'searching') {
            btnGenerate.style.display = 'inline-block';
            btnSort.innerText = view === 'sorting' ? 'Sort' : 'Search';
            btnSort.style.display = 'inline-block';
            generateBarsView();
        } else if (view === 'graph') {
            btnGenerate.style.display = 'inline-block';
            btnSort.innerText = 'Traverse';
            btnSort.style.display = 'inline-block';
            if (window.initGraph) window.initGraph();
        } else if (view === 'tree') {
            btnGenerate.style.display = 'inline-block';
            btnSort.innerText = 'Traverse';
            btnSort.style.display = 'inline-block';
            if (window.initTree) window.initTree();
        } else if (view === 'stack-queue') {
            btnGenerate.style.display = 'none';
            btnSort.style.display = 'none';
            if (window.initStackQueue) window.initStackQueue();
        } else if (view === 'expression') {
            btnGenerate.style.display = 'none';
            btnSort.style.display = 'none';
            // Specific eval button handles logic
        }
    }

    function generateBarsView() {
        STATE.array = generateRandomArray(30, 200);
        if (window.renderBars) window.renderBars(STATE.array);
    }

    btnGenerate.addEventListener('click', () => {
        if (STATE.isSorting) return;
        if (STATE.activeView === 'sorting' || STATE.activeView === 'searching') {
            generateBarsView();
        } else if (STATE.activeView === 'graph') {
            if (window.initGraph) window.initGraph();
        } else if (STATE.activeView === 'tree') {
            if (window.initTree) window.initTree();
        }
    });

    btnSort.addEventListener('click', async () => {
        if (STATE.isSorting) return;

        const algoObj = STATE.algorithms[STATE.activeView].find(a => a.id === STATE.activeAlgo);
        if (algoObj && algoObj.logicFn) {
            STATE.isSorting = true;
            btnSort.disabled = true;
            btnGenerate.disabled = true;

            await algoObj.logicFn();

            STATE.isSorting = false;
            btnSort.disabled = false;
            btnGenerate.disabled = false;
        }
    });

    btnPause.addEventListener('click', () => {
        if (!STATE.isSorting) return;
        STATE.isPaused = !STATE.isPaused;
        btnPause.innerText = STATE.isPaused ? 'Play' : 'Pause';
    });

    // Initial setup
    populateAlgorithms('sorting');
    handleViewChange('sorting');
});
