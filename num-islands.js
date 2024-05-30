function numIslands2(grid) {
    if (grid.length === 0) return 0;

    const rows = grid.length;
    const cols = grid[0].length;
    let islandCount = 0;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (grid[y][x] === 1) {
                islandCount++;
                const indicesToCheck = [[y, x]];

                while (indicesToCheck.length > 0) {
                    const [currY, currX] = indicesToCheck.pop();

                    if (grid[currY][currX] === 1) {
                        grid[currY][currX] = 2; // Mark the cell as visited

                        // Check up
                        if (currY - 1 >= 0 && grid[currY - 1][currX] === 1) {
                            indicesToCheck.push([currY - 1, currX]);
                        }
                        // Check down
                        if (currY + 1 < rows && grid[currY + 1][currX] === 1) {
                            indicesToCheck.push([currY + 1, currX]);
                        }
                        // Check left
                        if (currX - 1 >= 0 && grid[currY][currX - 1] === 1) {
                            indicesToCheck.push([currY, currX - 1]);
                        }
                        // Check right
                        if (currX + 1 < cols && grid[currY][currX + 1] === 1) {
                            indicesToCheck.push([currY, currX + 1]);
                        }
                    }
                }
            }
        }
    }

    return islandCount;
}


  const islandCount = (grid) => {
    const visited = new Set();
    const rows = grid.length;
    const cols = grid[0].length;
    let count = 0;
    for(let r = 0; r < rows; r++){
      for(let c = 0; c < cols; c++){
        if(grid[r][c] === 1){
        if(dfs(r,c,visited, grid) === true){
          count+=1;
        }
        }
      }
    }
      return count;
  }
  
  const dfs = (row, col, visited, grid) => {
    const inBoundsRow = 0 <= row && row < grid.length;
    const inBoundsCol = 0 <= col && col < grid[0].length;
    if(!inBoundsRow || !inBoundsCol) return false;
    if(grid[row][col] === 0) return false;
    
    const pos = row + ',' + col;
    if(visited.has(pos)) return false;
    visited.add(pos);
    dfs(row + 1, col, visited, grid);
    dfs(row - 1, col, visited, grid);
    dfs(row, col + 1, visited, grid);
    dfs(row, col - 1, visited, grid);
    
    return true;
  }
  
// Test cases
const testCases = [
    {
        name: "Small grid",
        grid: [
            [1, 1, 0, 0, 0],
            [1, 1, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 1, 1]
        ]
    },
    {
        name: "Medium grid",
        grid: [
            [1, 1, 0, 0, 1],
            [1, 1, 0, 0, 0],
            [0, 0, 1, 1, 1],
            [1, 0, 0, 1, 1],
            [0, 0, 1, 0, 0],
            [0, 1, 0, 0, 1]
        ]
    },
    {
        name: "Large grid",
        grid: Array(100).fill().map(() => Array(100).fill().map(() => Math.random() > 0.5 ? 1 : 0))
    },
    {
        name: "Large grid",
        grid: Array(1000).fill().map(() => Array(100).fill().map(() => Math.random() > 0.5 ? 1 : 0))
    }
];

testCases.forEach(({ name, grid }) => {
    const gridCopy1 = JSON.parse(JSON.stringify(grid)); // Copy for numIslands2
    const gridCopy2 = JSON.parse(JSON.stringify(grid)); // Copy for islandCount

    console.log(name);

    console.time('numIslands2');
    console.log(`Number of islands (numIslands2): ${numIslands2(gridCopy1)}`);
    console.timeEnd('numIslands2');

    console.time('islandCount');
    console.log(`Number of islands (islandCount): ${islandCount(gridCopy2)}`);
    console.timeEnd('islandCount');

    console.log('\n');
});