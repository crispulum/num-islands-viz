import React, { useState, useEffect } from 'react';
import './App.css';


const length = 12;

function createRandomGrid() {
  return Array.from({ length }, () =>
    Array.from({ length }, () => Math.round(Math.random()))
  );
}

function createEmptyToggleStates() {
  return Array.from({ length }, () =>
    Array.from({ length }, () => 0)
  );
}

function createEmptyHighlightedStates() {
  return Array.from({ length }, () => 
    Array.from({ length }, () => false)
  );
}

function toggleCell(row, col) {
  setHighlightedCurrentCell(prevState => {
    const newState = [...prevState];
    newState[row][col] = !newState[row][col];
    return newState;
  });
}


function App() {
  const [grid, setGrid] = useState(createRandomGrid());
  const [toggleStates, setToggleStates] = useState(createEmptyToggleStates());
  const [emphasizedState, setEmphasizedState] = useState(createEmptyHighlightedStates());
  const [stackContent, setStackContent] = useState([]);

  useEffect(() => {
    async function numIslands2(Realgrid) {
      let grid = [...Realgrid];
      if (grid.length === 0) return 0;
      const rows = grid.length;
      const cols = grid[0].length;
      let islandCount = 0;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let newEmphasizedState = [...emphasizedState];
          newEmphasizedState[y][x] = !newEmphasizedState[y][x];
          setEmphasizedState(newEmphasizedState);
          if (grid[y][x] === 1) {
            islandCount++;
            const coordinatesToCheck = [[y, x]];

            while (coordinatesToCheck.length > 0) {
              setStackContent([...coordinatesToCheck]);
              await new Promise(resolve => setTimeout(resolve, 1000));
              const [currY, currX] = coordinatesToCheck.pop();

              if (grid[currY][currX] === 1) {
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

            await new Promise(resolve => setTimeout(resolve, 500));
          } else {
            await new Promise(resolve => setTimeout(resolve, 150));
          }
          newEmphasizedState = [...emphasizedState];
          newEmphasizedState[y][x] = !newEmphasizedState[y][x];
          setEmphasizedState(newEmphasizedState);
          setStackContent([])
        }
      }

      return islandCount;
    }

    numIslands2(grid);
  }, []);

  return (
    <div className="App">
      <div className="grid-and-stack">
        <div className="grid-container">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`cell ${cell === 1 && 'one'} ${
                    cell === 2 && 'two'
                  } ${cell !== 1 && cell !== 2 && 'zero'} ${
                    toggleStates[rowIndex][colIndex] ? 'active' : ''
                  } ${
                    emphasizedState[rowIndex][colIndex] ? 'emphasized' : ''
                  }`}
                >
                  {cell}
                </div>
              ))}
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
