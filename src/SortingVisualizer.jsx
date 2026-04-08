// Web Programming Project - Algo-Rhythm
// Architecture: React.js (Hooks), Web Audio API, CSS Grid
import React, { useState, useEffect, useRef } from 'react';
import './SortingVisualizer.css';
import { playNote } from './SoundHelper';

const SortingVisualizer = () => {
    // ==========================================
    // STATE MANAGEMENT
    // ==========================================
    const [array, setArray] = useState([]);
    const [isSorting, setIsSorting] = useState(false);
    const [animationSpeed, setAnimationSpeed] = useState(50);
    const [selectedAlgo, setSelectedAlgo] = useState('bubble'); 
    const [userInput, setUserInput] = useState(''); 

    // Visual Tracking States for animations
    const [comparing, setComparing] = useState([]);
    const [swapping, setSwapping] = useState([]);
    const [sorted, setSorted] = useState([]);
    const [activeCodeLine, setActiveCodeLine] = useState(-1);

    // Team Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const speedRef = useRef(animationSpeed);

    // ==========================================
    // ALGORITHM DATABASE
    // ==========================================
    const algoInfo = {
        bubble: {
            name: "Bubble Sort",
            description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
            timeComplexity: "O(n²)",
            spaceComplexity: "O(1)",
            color: "#00e5ff", 
            code: `for (i = 0; i < n; i++) {\n  swapped = false;\n  for (j = 0; j < n-i-1; j++) {\n    if (arr[j] > arr[j+1]) {\n      swap(arr[j], arr[j+1]);\n      swapped = true;\n    }\n  }\n  if (!swapped) break;\n}`
        },
        selection: {
            name: "Selection Sort",
            description: "Divides the list into two parts: the sublist of items already sorted and the sublist of items remaining to be sorted.",
            timeComplexity: "O(n²)",
            spaceComplexity: "O(1)",
            color: "#ff9100", 
            code: `for (i = 0; i < n-1; i++) {\n  min_idx = i;\n  for (j = i+1; j < n; j++) {\n    if (arr[j] < arr[min_idx])\n      min_idx = j;\n  }\n  if (min_idx !== i)\n    swap(arr[min_idx], arr[i]);\n}`
        },
        insertion: {
            name: "Insertion Sort",
            description: "Builds the final sorted array one item at a time. Much less efficient on large lists than more advanced algorithms.",
            timeComplexity: "O(n²)",
            spaceComplexity: "O(1)",
            color: "#76ff03", 
            code: `for (i = 1; i < n; i++) {\n  key = arr[i]; j = i - 1;\n  while (j >= 0 && arr[j] > key) {\n    arr[j+1] = arr[j];\n    j--;\n  }\n  arr[j+1] = key;\n}`
        },
        merge: {
            name: "Merge Sort",
            description: "A Divide and Conquer algorithm. It divides the input array into two halves, calls itself for the two halves, and then merges them.",
            timeComplexity: "O(n log n)",
            spaceComplexity: "O(n)",
            color: "#d500f9", 
            code: `mergeSort(arr, l, r) {\n  if (l >= r) return;\n  mid = Math.floor((l+r)/2);\n  mergeSort(arr, l, mid);\n  mergeSort(arr, mid+1, r);\n  merge(arr, l, mid, r);\n}`
        },
        quick: {
            name: "Quick Sort",
            description: "Picks an element as pivot and partitions the given array around the picked pivot.",
            timeComplexity: "O(n log n)",
            spaceComplexity: "O(log n)",
            color: "#ff1744", 
            code: `quickSort(arr, low, high) {\n  if (low < high) {\n    pi = partition(arr, low, high);\n    quickSort(arr, low, pi-1);\n    quickSort(arr, pi+1, high);\n  }\n}`
        },
        heap: {
            name: "Heap Sort",
            description: "Comparison-based sorting technique based on Binary Heap data structure.",
            timeComplexity: "O(n log n)",
            spaceComplexity: "O(1)",
            color: "#2979ff", 
            code: `heapSort(arr) {\n  n = arr.length;\n  for (i = Math.floor(n/2)-1; i >= 0; i--)\n    heapify(arr, n, i);\n  for (i = n-1; i > 0; i--) {\n    swap(arr[0], arr[i]);\n    heapify(arr, i, 0);\n  }\n}`
        },
        counting: {
            name: "Counting Sort",
            description: "An integer sorting algorithm that operates by counting the number of objects that have each distinct key value.",
            timeComplexity: "O(n + k)",
            spaceComplexity: "O(k)",
            color: "#fdd835", 
            code: `countingSort(arr) {\n  max = Math.max(...arr);\n  count = Array(max+1).fill(0);\n  for (i = 0; i < arr.length; i++)\n    count[arr[i]]++;\n  z = 0;\n  for (i = 0; i <= max; i++) {\n    while (count[i] > 0) {\n      arr[z++] = i; count[i]--;\n    }\n  }\n}`
        }
    };

    // ==========================================
    // LIFECYCLE & HELPERS
    // ==========================================
    useEffect(() => {
        if (!isSorting) resetArray();
        // eslint-disable-next-line
    }, [selectedAlgo]);

    const handleSpeedChange = (e) => {
        const val = Number(e.target.value);
        setAnimationSpeed(val);
        speedRef.current = val;
    };

    const resetArray = () => {
        if (isSorting) return;
        const newArray = [];
        for (let i = 0; i < 40; i++) newArray.push(randomIntFromInterval(20, 400));
        setArray(newArray);
        setUserInput("");
        setComparing([]); setSwapping([]); setSorted([]); setActiveCodeLine(-1);
    };

    const generateFromInput = () => {
        // Robust regex to split by both commas and spaces smoothly
        const customArray = userInput
            .split(/[ ,]+/)
            .filter(val => val !== '')
            .map(num => parseInt(num.trim(), 10))
            .filter(num => !isNaN(num));

        if (customArray.length > 0) {
            setArray(customArray);
            setComparing([]); setSwapping([]); setSorted([]); setActiveCodeLine(-1);
        }
    };

    const getDelay = () => {
        const inverseSpeed = 101 - speedRef.current; 
        return Math.floor(Math.pow(inverseSpeed, 1.5));
    };

    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
    function randomIntFromInterval(min, max) { return Math.floor(Math.random() * (max - min + 1) + min); }

    const getBarClass = (idx) => {
        if (swapping.includes(idx)) return 'array-bar swapping';
        if (comparing.includes(idx)) return 'array-bar comparing';
        if (sorted.includes(idx)) return 'array-bar sorted';
        return 'array-bar';
    };

    // ==========================================
    // SORTING ENGINE
    // ==========================================
    const runSort = async () => {
        if (isSorting) return;
        setIsSorting(true);
        setComparing([]); setSwapping([]); setSorted([]); setActiveCodeLine(-1);
        
        let currentArr = [...array];
        
        // Execute the selected algorithm
        switch (selectedAlgo) {
            case 'bubble': await bubbleSort(currentArr); break;
            case 'selection': await selectionSort(currentArr); break;
            case 'insertion': await insertionSort(currentArr); break;
            case 'merge': await mergeSortHelper(currentArr, 0, currentArr.length - 1); break;
            case 'quick': await quickSortHelper(currentArr, 0, currentArr.length - 1); break;
            case 'heap': await heapSortHelper(currentArr); break;
            case 'counting': await countingSort(currentArr); break;
            default: break;
        }
        
        // Cleanup and finish animations
        setComparing([]); setSwapping([]); setActiveCodeLine(-1);
        setSorted(Array.from({length: currentArr.length}, (_, i) => i));
        
        // Play victory sound
        const tada = new Audio('/tada.mp3.mpeg'); 
        tada.volume = 1; 
        tada.play().catch(err => console.log("Audio blocked by browser:", err));
        
        setIsSorting(false);
    };

    const bubbleSort = async (arr) => {
        let currentSorted = [];
        for (let i = 0; i < arr.length; i++) {
            setActiveCodeLine(4); await sleep(getDelay() / 2);
            let swapped = false;
            for (let j = 0; j < arr.length - i - 1; j++) {
                setActiveCodeLine(6); setComparing([j, j + 1]);
                setActiveCodeLine(7); playNote(arr[j]); await sleep(getDelay()); 

                if (arr[j] > arr[j + 1]) {
                    setActiveCodeLine(8); setSwapping([j, j + 1]);
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    swapped = true; setArray([...arr]); await sleep(getDelay()); 
                }
                setSwapping([]);
            }
            if (!swapped) break;
            currentSorted.push(arr.length - 1 - i); setSorted([...currentSorted]);
        }
    };

    const selectionSort = async (arr) => {
        let currentSorted = [];
        for (let i = 0; i < arr.length; i++) {
            setActiveCodeLine(3); let minIdx = i;
            setActiveCodeLine(5); await sleep(getDelay() / 2);
            
            for (let j = i + 1; j < arr.length; j++) {
                setActiveCodeLine(6); setComparing([minIdx, j]);
                setActiveCodeLine(8); playNote(arr[j]); await sleep(getDelay());

                if (arr[j] < arr[minIdx]) {
                    setActiveCodeLine(9); minIdx = j;
                }
            }
            setActiveCodeLine(13);
            if (minIdx !== i) {
                setSwapping([i, minIdx]); playNote(arr[minIdx]);
                [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
                setArray([...arr]); await sleep(getDelay()); setSwapping([]);
            }
            currentSorted.push(i); setSorted([...currentSorted]);
        }
    };

    const insertionSort = async (arr) => {
        let currentSorted = [0]; setSorted([...currentSorted]);
        for (let i = 1; i < arr.length; i++) {
            setActiveCodeLine(3); await sleep(getDelay() / 2);
            let key = arr[i]; let j = i - 1;
            setActiveCodeLine(9); playNote(key); setComparing([i]); await sleep(getDelay());

            while (j >= 0 && arr[j] > key) {
                setSwapping([j, j + 1]); setActiveCodeLine(10); playNote(arr[j]);
                arr[j + 1] = arr[j]; setArray([...arr]); await sleep(getDelay());
                j = j - 1;
            }
            setActiveCodeLine(15); arr[j + 1] = key;
            setArray([...arr]); setSwapping([]); currentSorted.push(i);
            setSorted([...currentSorted]); await sleep(getDelay());
        }
    };

    const mergeSortHelper = async (arr, start, end) => {
        if (start >= end) return;
        setActiveCodeLine(4); await sleep(getDelay()/2);
        const mid = Math.floor((start + end) / 2);
        setActiveCodeLine(7); await mergeSortHelper(arr, start, mid);
        setActiveCodeLine(8); await mergeSortHelper(arr, mid + 1, end);
        setActiveCodeLine(11); await merge(arr, start, mid, end);
    };

    const merge = async (arr, start, mid, end) => {
        const leftArr = arr.slice(start, mid + 1);
        const rightArr = arr.slice(mid + 1, end + 1);
        let i = 0, j = 0, k = start;
        while (i < leftArr.length && j < rightArr.length) {
            setComparing([start + i, mid + 1 + j]);
            playNote(leftArr[i] <= rightArr[j] ? leftArr[i] : rightArr[j]);
            if (leftArr[i] <= rightArr[j]) { arr[k] = leftArr[i]; i++; } 
            else { arr[k] = rightArr[j]; j++; }
            setSwapping([k]); setArray([...arr]); await sleep(getDelay()); k++;
        }
        while (i < leftArr.length) {
            setSwapping([k]); playNote(leftArr[i]); arr[k] = leftArr[i]; i++; k++;
            setArray([...arr]); await sleep(getDelay());
        }
        while (j < rightArr.length) {
            setSwapping([k]); playNote(rightArr[j]); arr[k] = rightArr[j]; j++; k++;
            setArray([...arr]); await sleep(getDelay());
        }
        setComparing([]); setSwapping([]);
    };

    const quickSortHelper = async (arr, low, high) => {
        setActiveCodeLine(2);
        if (low < high) {
            setActiveCodeLine(4); let pi = await partition(arr, low, high);
            setActiveCodeLine(8); await quickSortHelper(arr, low, pi - 1);
            setActiveCodeLine(9); await quickSortHelper(arr, pi + 1, high);
        }
    };

    const partition = async (arr, low, high) => {
        let pivot = arr[high]; let i = (low - 1);
        for (let j = low; j < high; j++) {
            setComparing([j, high]); playNote(arr[j]); await sleep(getDelay()/2);
            if (arr[j] < pivot) {
                i++; setSwapping([i, j]);
                [arr[i], arr[j]] = [arr[j], arr[i]];
                setArray([...arr]); await sleep(getDelay());
            }
        }
        setSwapping([i + 1, high]);
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        setArray([...arr]); await sleep(getDelay());
        setComparing([]); setSwapping([]); return i + 1;
    };

    const heapSortHelper = async (arr) => {
        let n = arr.length; setActiveCodeLine(5);
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            setActiveCodeLine(6); await heapify(arr, n, i);
        }
        setActiveCodeLine(10);
        for (let i = n - 1; i > 0; i--) {
            setActiveCodeLine(11); setSwapping([0, i]); playNote(arr[0]); 
            [arr[0], arr[i]] = [arr[i], arr[0]]; 
            setArray([...arr]); await sleep(getDelay());
            setActiveCodeLine(14); await heapify(arr, i, 0);
        }
        setSwapping([]);
    };

    const heapify = async (arr, n, i) => {
        let largest = i; let left = 2 * i + 1; let right = 2 * i + 2;
        if (left < n && arr[left] > arr[largest]) largest = left;
        if (right < n && arr[right] > arr[largest]) largest = right;
        if (largest !== i) {
            setComparing([i, largest]); playNote(arr[largest]); await sleep(getDelay());
            setSwapping([i, largest]);
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            setArray([...arr]); await sleep(getDelay());
            await heapify(arr, n, largest);
        }
    };

    const countingSort = async (arr) => {
        let max = Math.max(...arr); 
        let count = new Array(max + 1).fill(0);
        setActiveCodeLine(6);
        for (let i = 0; i < arr.length; i++) {
            setComparing([i]); playNote(arr[i]); count[arr[i]]++; await sleep(getDelay()/2);
        }
        let z = 0; setActiveCodeLine(11);
        for (let i = 0; i <= max; i++) {
            while (count[i] > 0) {
                setActiveCodeLine(12); arr[z] = i; playNote(arr[z]);
                setSwapping([z]); z++; count[i]--;
                setArray([...arr]); await sleep(getDelay());
            }
        }
        setComparing([]); setSwapping([]);
    };

    // ==========================================
    // RENDER UI
    // ==========================================
    return (
        <div className="dashboard-container">
            <header className="app-header">
                <div className="title-container" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src="/favicon.svg" alt="Algo-Rhythm Logo" style={{ width: '40px', height: '40px' }} />
                    <h1>ALGO<span className="highlight">-RHYTHM</span></h1>
                </div>
                <div className="algo-selector">
                    <button className="btn-members" onClick={() => setIsModalOpen(true)}>Members</button>
                    <select value={selectedAlgo} onChange={(e) => setSelectedAlgo(e.target.value)} disabled={isSorting}>
                        <option value="bubble">Bubble Sort</option>
                        <option value="selection">Selection Sort</option>
                        <option value="insertion">Insertion Sort</option>
                        <option value="merge">Merge Sort</option>
                        <option value="quick">Quick Sort</option>
                        <option value="heap">Heap Sort</option>
                        <option value="counting">Counting Sort</option>
                    </select>
                    <button className="btn-play" onClick={runSort} disabled={isSorting}>
                        {isSorting ? 'SORTING...' : 'VISUALIZE IT'}
                    </button>
                </div>
            </header>

            <div className="bento-grid">
                {/* DYNAMIC GRAPH COMPONENT */}
                <div className="tile graph-tile">
                    <div className="graph-wrapper" style={{ display: 'flex', height: '100%', width: '100%', flexDirection: 'column' }}>
                        
                        <div style={{ display: 'flex', flexGrow: 1, width: '100%', overflow: 'hidden' }}>
                            {/* FIXED Y-AXIS WITH LABEL */}
                            <div className="y-axis-container" style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                <div className="y-axis-label" style={{ transform: 'rotate(-90deg)', color: '#888', fontSize: '0.9rem', letterSpacing: '2px', whiteSpace: 'nowrap', opacity: 0.8 }}>
                                    VALUE
                                </div>
                                <div className="y-axis-numbers" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', fontSize: '0.8rem', color: '#888', textAlign: 'right' }}>
                                    <span>{array.length > 0 ? Math.max(...array) : 0}</span>
                                    <span>{array.length > 0 ? Math.floor(Math.max(...array) / 2) : 0}</span>
                                    <span>0</span>
                                </div>
                            </div>
                            
                            {/* BARS */}
                            <div className="array-container" style={{ display: 'flex', alignItems: 'flex-end', height: '100%', width: '100%', gap: '1px' }}>
                                {array.map((value, idx) => {
                                    const maxValue = Math.max(...array);
                                    return (
                                        <div 
                                            className={getBarClass(idx)} 
                                            key={idx}
                                            style={{
                                                height: `${(value / maxValue) * 100}%`,
                                                width: `${100 / array.length}%`, 
                                                backgroundColor: (!swapping.includes(idx) && !comparing.includes(idx) && !sorted.includes(idx)) ? algoInfo[selectedAlgo].color : '',
                                                transition: 'height 0.1s ease-in' 
                                            }}
                                        ></div>
                                    );
                                })}
                            </div>
                        </div>
                        
                        {/* FIXED X-AXIS LABEL (Pulled up closer to the graph) */}
                        <div className="x-axis" style={{ textAlign: 'center', color: '#888', fontSize: '0.9rem', marginTop: '10px', letterSpacing: '2px', paddingLeft: '50px' }}>
                            INDEX
                        </div>
                    </div>
                </div>

                {/* CONTROLS MENU */}
                <div className="tile controls-tile">
                    <h3>Controls</h3>
                    <div className="control-group">
                        <label>Speed</label>
                        <input type="range" min="1" max="100" value={animationSpeed} onChange={handleSpeedChange} />
                    </div>
                    <div className="control-group">
                        <label>Custom Data</label>
                        <div className="input-row">
                            <input type="text" placeholder="10, 50, 20..." value={userInput} onChange={(e) => setUserInput(e.target.value)} disabled={isSorting} />
                            <button onClick={generateFromInput} disabled={isSorting}>Set</button>
                        </div>
                    </div>
                    <button className="btn-reset" onClick={resetArray} disabled={isSorting}>Generate Random</button>
                </div>

                {/* COMPLEXITY ANALYSIS */}
                <div className="tile info-tile">
                    <h3>Complexity Analysis</h3>
                    <div className="stats-grid">
                        <div className="stat-box">
                            <span>Worst Time</span>
                            <strong>{algoInfo[selectedAlgo].timeComplexity}</strong>
                        </div>
                        <div className="stat-box">
                            <span>Worst Space</span>
                            <strong>{algoInfo[selectedAlgo].spaceComplexity}</strong>
                        </div>
                    </div>
                    <p className="description">{algoInfo[selectedAlgo].description}</p>
                </div>

                {/* DYNAMIC CODE HIGHLIGHTER */}
                <div className="tile code-tile">
                    <h3>Algorithm Logic</h3>
                    <pre>
                        <code>
                            {algoInfo[selectedAlgo].code.split('\n').map((line, index) => (
                                <div key={index} className={`code-line ${activeCodeLine === index ? 'active' : ''}`}>
                                    {line}
                                </div>
                            ))}
                        </code>
                    </pre>
                </div>
            </div>

            {/* TEAM MEMBERS MODAL */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
                        <h2>Development Team</h2>

                        <div className="member-card">
                            <h4>Gudivada Vishwak Sai</h4>
                            <span className="reg-no">24BYB0053</span>
                            <p className="contribution">
                                <strong>Role:</strong> UI/UX & Audio Integration<br/>
                                <strong>Contributions:</strong> Designed the responsive CSS Bento Grid architecture, synchronized UI animations, and integrated the Web Audio API.
                            </p>
                        </div>                        
                        
                        <div className="member-card">
                            <h4>Aalap Kishore Panda</h4>
                            <span className="reg-no">24BYB0191</span>
                            <p className="contribution">
                                <strong>Role:</strong> Logic & State Architecture<br/>
                                <strong>Contributions:</strong> Engineered core sorting algorithms in JavaScript and managed complex React state logic for asynchronous visual tracking.
                            </p>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default SortingVisualizer;