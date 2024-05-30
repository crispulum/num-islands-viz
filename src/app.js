import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function createRandomGrid(length) {
  return Array.from({ length }, () =>
    Array.from({ length }, () => Math.round(Math.random()))
  );
}

function createEmptyToggleStates(length) {
  return Array.from({ length }, () =>
    Array.from({ length }, () => false)
  );
}

function createEmptyHighlightedStates(length) {
  return Array.from({ length }, () =>
    Array.from({ length }, () => false)
  );
}

function App() {
  const initialGridSize = 12;
  const [gridSize, setGridSize] = useState(initialGridSize);
  const [grid, setGrid] = useState(createRandomGrid(initialGridSize));
  const [toggleStates, setToggleStates] = useState(createEmptyToggleStates(initialGridSize));
  const [emphasizedState, setEmphasizedState] = useState(createEmptyHighlightedStates(initialGridSize));
  const [stackContent, setStackContent] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(isPaused);
  const [coordinatesToCheck, setCoordinatesToCheck] = useState([]);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    let isCancelled = false;

    async function numIslands2(Realgrid) {
      let grid = [...Realgrid];
      if (grid.length === 0) return 0;
      const rows = grid.length;
      const cols = grid[0].length;
      let islandCount = 0;
      let newCoordinatesToCheck = [];

      for (let y = 0; y < rows && !isCancelled; y++) {
        for (let x = 0; x < cols && !isCancelled; x++) {
          let newEmphasizedState = [...emphasizedState];
          newEmphasizedState[y][x] = !newEmphasizedState[y][x];
          setEmphasizedState(newEmphasizedState);
          //console.log(isPaused + " is paused");

          let paused = isPausedRef.current;

          while (paused && !isCancelled) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            paused = isPausedRef.current;
          }

          if (grid[y][x] === 1 && !isCancelled) {
            islandCount++;
            const coordinatesToCheck = [[y, x]];

            newCoordinatesToCheck.push(...coordinatesToCheck);

            while (coordinatesToCheck.length > 0 && !isCancelled) {
              setStackContent([...coordinatesToCheck]);
              setCoordinatesToCheck([...coordinatesToCheck]);
              await new Promise(resolve => setTimeout(resolve, 1000));
              const [currY, currX] = coordinatesToCheck.pop();
              let paused = isPausedRef.current;
              while (paused && !isCancelled) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                paused = isPausedRef.current;
              }
              if (grid[currY][currX] === 1 && !isCancelled) {
                grid[currY][currX] = 2;
                setGrid([...grid]);
                if (currY - 1 >= 0 && grid[currY - 1][currX] === 1) {
                  coordinatesToCheck.push([currY - 1, currX]);
                }
                if (currY + 1 < rows && grid[currY + 1][currX] === 1) {
                  coordinatesToCheck.push([currY + 1, currX]);
                }
                if (currX - 1 >= 0 && grid[currY][currX - 1] === 1) {
                  coordinatesToCheck.push([currY, currX - 1]);
                }
                if (currX + 1 < cols && grid[currY][currX + 1] === 1) {
                  coordinatesToCheck.push([currY, currX + 1]);
                }
              }
            }
            setStackContent([]);
            await new Promise(resolve => setTimeout(resolve, 500));
          } else {
            await new Promise(resolve => setTimeout(resolve, 150));
          }
          newEmphasizedState = [...emphasizedState];
          newEmphasizedState[y][x] = !newEmphasizedState[y][x];
          setEmphasizedState(newEmphasizedState);
          setStackContent([]);
          setCoordinatesToCheck([]);
        }
      }

      return islandCount;
    }

    numIslands2(grid);

    return () => {
      isCancelled = true;
    };
  }, [resetKey]);

  const handleRestart = () => {
    setGrid(createRandomGrid(gridSize));
    setToggleStates(createEmptyToggleStates(gridSize));
    setEmphasizedState(createEmptyHighlightedStates(gridSize));
    setStackContent([]);
    setCoordinatesToCheck([]);
    setResetKey(prevKey => prevKey + 1);
  };

  const handleGridSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    if (!isNaN(newSize) && newSize > 0) {
      setGridSize(newSize);
    }
  };

  const togglePause = () => {
    setIsPaused(prevState => !prevState);
  };

  return (
    <div className="App">
      <div className="grid-and-stack">
        <div className="control-panel">
          <input
            value={gridSize}
            onChange={handleGridSizeChange}
            placeholder="Grid Size"
          />
          <button onClick={handleRestart}>Restart</button>
          <button onClick={togglePause}>{isPaused ? "Resume" : "Pause"}</button>
        </div>
        <div className="grid-container">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, colIndex) => {
                const isInCoordinatesToCheck = coordinatesToCheck.some(coord => coord[0] === rowIndex && coord[1] === colIndex);
                console.log(coordinatesToCheck);
                return (
                  <div
                    key={colIndex}
                    className={`cell ${cell === 1 && 'one'} ${cell === 2 && 'two'
                      } ${cell !== 1 && cell !== 2 && 'zero'} ${toggleStates[rowIndex][colIndex] ? 'active' : ''
                      } ${emphasizedState[rowIndex][colIndex] ? 'emphasized' : ''
                      } ${isInCoordinatesToCheck ? 'outlined' : ''}`}
                  >
                    {cell}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="stack-container">
          <div className="stack-header">
            <h2>Stack Content</h2>
          </div>
          <div className="stack-content">
            {stackContent.map((coord, index) => (
              <div className="stack-item" key={index}>
                [{coord[0]}, {coord[1]}]
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
