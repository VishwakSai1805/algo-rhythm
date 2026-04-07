// Web Programming Project - Algo-Rhythm (Phase 9: Final Polish & Team Details)
import React, { useState, useEffect, useRef } from 'react';
import './SortingVisualizer.css';
import { playNote } from './SoundHelper';

const SortingVisualizer = () => {
    const [array, setArray] = useState([]);
    const [isSorting, setIsSorting] = useState(false);
    const [animationSpeed, setAnimationSpeed] = useState(50);
    const [selectedAlgo, setSelectedAlgo] = useState('bubble'); 
    const [userInput, setUserInput] = useState(''); 

    // Visual Tracking States
    const [comparing, setComparing] = useState([]);
    const [swapping, setSwapping] = useState([]);
    const [sorted, setSorted] = useState([]);
    const [activeCodeLine, setActiveCodeLine] = useState(-1);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);

    const speedRef = useRef(animationSpeed);

// --- ACADEMIC DATABASE (Concise Code Version) ---
    const algoInfo = {
        bubble: {
            name: "Bubble Sort",
            description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
            timeComplexity: "O(n²)",
            spaceComplexity: "O(1)",
            color: "#00e5ff", 
            code: `for (i = 0; i < n; i++) {
  swapped = false;
  for (j = 0; j < n-i-1; j++) {
    if (arr[j] > arr[j+1]) {
      swap(arr[j], arr[j+1]);
      swapped = true;
    }
  }
  if (!swapped) break;
}`
        },
        selection: {
            name: "Selection Sort",
            description: "Divides the list into two parts: the sublist of items already sorted and the sublist of items remaining to be sorted.",
            timeComplexity: "O(n²)",
            spaceComplexity: "O(1)",
            color: "#ff9100", 
            code: `for (i = 0; i < n-1; i++) {
  min_idx = i;
  for (j = i+1; j < n; j++) {
    if (arr[j] < arr[min_idx])
      min_idx = j;
  }
  if (min_idx !== i)
    swap(arr[min_idx], arr[i]);
}`
        },
        insertion: {
            name: "Insertion Sort",
            description: "Builds the final sorted array one item at a time. Much less efficient on large lists than more advanced algorithms.",
            timeComplexity: "O(n²)",
            spaceComplexity: "O(1)",
            color: "#76ff03", 
            code: `for (i = 1; i < n; i++) {
  key = arr[i]; j = i - 1;
  while (j >= 0 && arr[j] > key) {
    arr[j+1] = arr[j];
    j--;
  }
  arr[j+1] = key;
}`
        },
        merge: {
            name: "Merge Sort",
            description: "A Divide and Conquer algorithm. It divides the input array into two halves, calls itself for the two halves, and then merges them.",
            timeComplexity: "O(n log n)",
            spaceComplexity: "O(n)",
            color: "#d500f9", 
            code: `mergeSort(arr, l, r) {
  if (l >= r) return;
  mid = Math.floor((l+r)/2);
  mergeSort(arr, l, mid);
  mergeSort(arr, mid+1, r);
  merge(arr, l, mid, r);
}`
        },
        quick: {
            name: "Quick Sort",
            description: "Picks an element as pivot and partitions the given array around the picked pivot.",
            timeComplexity: "O(n log n)",
            spaceComplexity: "O(log n)",
            color: "#ff1744", 
            code: `quickSort(arr, low, high) {
  if (low < high) {
    pi = partition(arr, low, high);
    quickSort(arr, low, pi-1);
    quickSort(arr, pi+1, high);
  }
}`
        },
        heap: {
            name: "Heap Sort",
            description: "Comparison-based sorting technique based on Binary Heap data structure.",
            timeComplexity: "O(n log n)",
            spaceComplexity: "O(1)",
            color: "#2979ff", 
            code: `heapSort(arr) {
  n = arr.length;
  for (i = Math.floor(n/2)-1; i >= 0; i--)
    heapify(arr, n, i);
  for (i = n-1; i > 0; i--) {
    swap(arr[0], arr[i]);
    heapify(arr, i, 0);
  }
}`
        },
        counting: {
            name: "Counting Sort",
            description: "An integer sorting algorithm that operates by counting the number of objects that have each distinct key value.",
            timeComplexity: "O(n + k)",
            spaceComplexity: "O(k)",
            color: "#fdd835", 
            code: `countingSort(arr) {
  max = Math.max(...arr);
  count = Array(max+1).fill(0);
  for (i = 0; i < arr.length; i++)
    count[arr[i]]++;
  z = 0;
  for (i = 0; i <= max; i++) {
    while (count[i] > 0) {
      arr[z++] = i; count[i]--;
    }
  }
}`
        }
    };


    // --- NEW: AUTO GENERATE ON ALGO CHANGE ---
    useEffect(() => {
        if (!isSorting) {
            resetArray();
        }
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
        setComparing([]);
        setSwapping([]);
        setSorted([]);
        setActiveCodeLine(-1);
    };

    const generateFromInput = () => {
        const customArray = userInput.split(',').map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num));
        if (customArray.length > 0) {
            setArray(customArray);
            setComparing([]); setSwapping([]); setSorted([]); setActiveCodeLine(-1);
        }
    };

    const getDelay = () => {
        const inverseSpeed = 101 - speedRef.current; 
        return Math.floor(Math.pow(inverseSpeed, 1.5));
    };

    // --- ALGORITHM EXECUTION (Stripped back highlighting to match new code blocks) ---
    // Note: To keep the code clean and prevent bugs, we only highlight the active loops in this version
const runSort = async () => {
        if (isSorting) return;
        setIsSorting(true);
        setComparing([]); setSwapping([]); setSorted([]); setActiveCodeLine(-1);
        
        let currentArr = [...array];
        
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
        
        setComparing([]);
        setSwapping([]);
        setActiveCodeLine(-1);
        setSorted(Array.from({length: currentArr.length}, (_, i) => i));
        
        // --- ADD THESE 3 LINES HERE ---
        const tada = new Audio('/tada.mp3.mpeg'); 
        tada.volume = 1; // Set volume to 50% so it doesn't blow out speakers
        tada.play().catch(err => console.log("Audio blocked by browser:", err));
        
        setIsSorting(false);
    };

    const bubbleSort = async (arr) => {
        let currentSorted = [];
        for (let i = 0; i < arr.length; i++) {
            setActiveCodeLine(4); await sleep(getDelay() / 2);
            let swapped = false;
            for (let j = 0; j < arr.length - i - 1; j++) {
                setActiveCodeLine(6); 
                setComparing([j, j + 1]);
                setActiveCodeLine(7);
                playNote(arr[j]); 
                await sleep(getDelay()); 

                if (arr[j] > arr[j + 1]) {
                    setActiveCodeLine(8);
                    setSwapping([j, j + 1]);
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    swapped = true;
                    setArray([...arr]);
                    await sleep(getDelay()); 
                }
                setSwapping([]);
            }
            if (!swapped) break;
            currentSorted.push(arr.length - 1 - i);
            setSorted([...currentSorted]);
        }
    };

    const selectionSort = async (arr) => {
        let currentSorted = [];
        for (let i = 0; i < arr.length; i++) {
            setActiveCodeLine(3);
            let minIdx = i;
            setActiveCodeLine(5); await sleep(getDelay() / 2);
            
            for (let j = i + 1; j < arr.length; j++) {
                setActiveCodeLine(6);
                setComparing([minIdx, j]);
                setActiveCodeLine(8);
                playNote(arr[j]); 
                await sleep(getDelay());

                if (arr[j] < arr[minIdx]) {
                    setActiveCodeLine(9);
                    minIdx = j;
                }
            }
            
            setActiveCodeLine(13);
            if (minIdx !== i) {
                setSwapping([i, minIdx]);
                playNote(arr[minIdx]);
                [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
                setArray([...arr]);
                await sleep(getDelay());
                setSwapping([]);
            }
            currentSorted.push(i);
            setSorted([...currentSorted]);
        }
    };

    const insertionSort = async (arr) => {
        let currentSorted = [0];
        setSorted([...currentSorted]);
        
        for (let i = 1; i < arr.length; i++) {
            setActiveCodeLine(3); await sleep(getDelay() / 2);
            let key = arr[i];
            let j = i - 1;
            setActiveCodeLine(9);
            
            playNote(key);
            setComparing([i]);
            await sleep(getDelay());

            while (j >= 0 && arr[j] > key) {
                setSwapping([j, j + 1]);
                setActiveCodeLine(10);
                playNote(arr[j]);
                arr[j + 1] = arr[j];
                setArray([...arr]);
                await sleep(getDelay());
                j = j - 1;
            }
            setActiveCodeLine(15);
            arr[j + 1] = key;
            setArray([...arr]);
            setSwapping([]);
            currentSorted.push(i);
            setSorted([...currentSorted]);
            await sleep(getDelay());
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
        let pivot = arr[high];
        let i = (low - 1);
        for (let j = low; j < high; j++) {
            setComparing([j, high]); playNote(arr[j]); await sleep(getDelay()/2);
            if (arr[j] < pivot) {
                i++;
                setSwapping([i, j]);
                [arr[i], arr[j]] = [arr[j], arr[i]];
                setArray([...arr]); await sleep(getDelay());
            }
        }
        setSwapping([i + 1, high]);
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        setArray([...arr]); await sleep(getDelay());
        setComparing([]); setSwapping([]);
        return i + 1;
    };

    const heapSortHelper = async (arr) => {
        let n = arr.length; setActiveCodeLine(5);
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            setActiveCodeLine(6); await heapify(arr, n, i);
        }
        setActiveCodeLine(10);
        for (let i = n - 1; i > 0; i--) {
            setActiveCodeLine(11);
            setSwapping([0, i]); playNote(arr[0]); 
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

    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
    function randomIntFromInterval(min, max) { return Math.floor(Math.random() * (max - min + 1) + min); }

    const getBarClass = (idx) => {
        if (swapping.includes(idx)) return 'array-bar swapping';
        if (comparing.includes(idx)) return 'array-bar comparing';
        if (sorted.includes(idx)) return 'array-bar sorted';
        return 'array-bar';
    };

    return (
        <div className="dashboard-container">
            <header className="app-header">
                <h1>ALGO<span className="highlight">-RHYTHM</span></h1>
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
                <div className="tile graph-tile">
                    <div className="graph-wrapper">
                        <div className="y-axis">Value</div>
                        <div className="array-container">
                            {array.map((value, idx) => (
                                <div 
                                    className={getBarClass(idx)} 
                                    key={idx}
                                    style={{
                                        height: `${value}px`,
                                        width: `${900 / array.length}px`,
                                        backgroundColor: (!swapping.includes(idx) && !comparing.includes(idx) && !sorted.includes(idx)) ? algoInfo[selectedAlgo].color : ''
                                    }}
                                ></div>
                            ))}
                        </div>
                        <div className="x-axis">Index</div>
                    </div>
                </div>

                {/* RESTORED CONTROLS HEADING HERE */}
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
                            <h4>Aalap Kishore Panda</h4>
                            <span className="reg-no">24BYB0191</span>
                            <p className="contribution">
                                <strong>Role:</strong> Logic & State Architecture<br/>
                                <strong>Contributions:</strong> Engineered core sorting algorithms in JavaScript and managed complex React state logic for asynchronous visual tracking.
                            </p>
                        </div>
                        
                        <div className="member-card">
                            <h4>Gudivada Vishwak Sai</h4>
                            <span className="reg-no">24BYB0053</span>
                            <p className="contribution">
                                <strong>Role:</strong> UI/UX & Audio Integration<br/>
                                <strong>Contributions:</strong> Designed the responsive CSS Bento Grid architecture, synchronized UI animations, and integrated the Web Audio API.
                            </p>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default SortingVisualizer;