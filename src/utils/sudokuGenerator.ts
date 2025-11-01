// Sudoku Generator Utility

import type { Grid, BoxDimensions, Difficulty } from '../types';

/**
 * Gets box dimensions for a given grid size
 */
function getBoxDimensions(size: number): BoxDimensions {
  if (size === 9) return { rows: 3, cols: 3 };
  if (size === 6) return { rows: 2, cols: 3 };
  if (size === 4) return { rows: 2, cols: 2 };
  // Default to square boxes
  const boxSize = Math.sqrt(size);
  return { rows: boxSize, cols: boxSize };
}

/**
 * Generates a valid Sudoku grid of the specified size
 */
export function generateSudoku(size: number): Grid {
  const grid: Grid = new Array(size).fill(null).map(() => new Array(size).fill(0));
  const boxDims = getBoxDimensions(size);

  // Fill diagonal boxes first
  fillDiagonalBoxes(grid, size, boxDims);

  // Fill remaining cells using backtracking
  solveSudoku(grid, size, boxDims);

  return grid;
}

/**
 * Fills the diagonal boxes with valid numbers
 */
function fillDiagonalBoxes(grid: Grid, size: number, boxDims: BoxDimensions): void {
  const boxesPerRow = size / boxDims.cols;
  for (let boxRow = 0; boxRow < boxesPerRow; boxRow++) {
    for (let boxCol = 0; boxCol < boxesPerRow; boxCol++) {
      // Fill only diagonal boxes
      if (boxRow === boxCol) {
        const startRow = boxRow * boxDims.rows;
        const startCol = boxCol * boxDims.cols;
        fillBox(grid, startRow, startCol, boxDims, size);
      }
    }
  }
}

/**
 * Fills a box with random valid numbers
 */
function fillBox(grid: Grid, row: number, col: number, boxDims: BoxDimensions, size: number): void {
  const numbers = shuffleArray([...new Array(size)].map((_, i) => i + 1));
  let numIndex = 0;

  for (let i = 0; i < boxDims.rows; i++) {
    for (let j = 0; j < boxDims.cols; j++) {
      grid[row + i][col + j] = numbers[numIndex++];
    }
  }
}

/**
 * Solves the Sudoku using backtracking
 */
function solveSudoku(grid: Grid, size: number, boxDims: BoxDimensions): boolean {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === 0) {
        const numbers = shuffleArray([...new Array(size)].map((_, i) => i + 1));
        for (const num of numbers) {
          if (isValid(grid, row, col, num, size, boxDims)) {
            grid[row][col] = num;
            if (solveSudoku(grid, size, boxDims)) {
              return true;
            }
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

/**
 * Checks if a number can be placed at the given position
 */
function isValid(grid: Grid, row: number, col: number, num: number, size: number, boxDims: BoxDimensions): boolean {
  // Check row
  for (let j = 0; j < size; j++) {
    if (grid[row][j] === num) return false;
  }

  // Check column
  for (let i = 0; i < size; i++) {
    if (grid[i][col] === num) return false;
  }

  // Check box
  const boxRow = Math.floor(row / boxDims.rows) * boxDims.rows;
  const boxCol = Math.floor(col / boxDims.cols) * boxDims.cols;
  for (let i = boxRow; i < boxRow + boxDims.rows; i++) {
    for (let j = boxCol; j < boxCol + boxDims.cols; j++) {
      if (grid[i][j] === num) return false;
    }
  }

  return true;
}

/**
 * Gets the box index for a given cell position
 */
function getBoxIndex(row: number, col: number, boxDims: BoxDimensions, size: number): number {
  const boxRow = Math.floor(row / boxDims.rows);
  const boxCol = Math.floor(col / boxDims.cols);
  const boxesPerRow = size / boxDims.cols;
  return boxRow * boxesPerRow + boxCol;
}

/**
 * Gets the spatial region index for a given cell position
 * Divides grid into regions for better spatial distribution
 */
function getSpatialRegion(row: number, col: number, size: number): number {
  // Divide grid into 9 regions (3x3 grid of regions)
  // For 9x9: each region is 3x3 cells
  // For 6x6: each region is 2x2 cells
  // For 4x4: each region is roughly 1.33x1.33, so we use 2x2 regions
  const regionSize = Math.ceil(size / 3);
  const regionRow = Math.floor(row / regionSize);
  const regionCol = Math.floor(col / regionSize);
  return regionRow * 3 + regionCol;
}

/**
 * Removes cells based on difficulty level
 * Ensures each row, column, and box has at least one missing number
 * Distributes removals evenly to avoid clustering
 */
export function createPuzzle(grid: Grid, size: number, difficulty: Difficulty): Grid {
  const puzzle: Grid = grid.map(row => [...row]);
  const boxDims = getBoxDimensions(size);
  const totalCells = size * size;
  const percentages: Record<Difficulty, number> = {
    easy: 0.65,        // Kids Easy: 65% filled (very easy for children)
    medium: 0.40,      // Adult Easy: 40% filled
    hard: 0.34,        // Adult Medium: 34% filled
    'extremely hard': 0.28  // Adult Hard: 28% filled
  };

  const targetCellsToRemove = Math.floor(totalCells * (1 - percentages[difficulty]));
  const removedCells = new Set<string>();

  // Track removal counts for each row, column, box, and spatial region
  const rowRemovalCounts = new Array(size).fill(0);
  const colRemovalCounts = new Array(size).fill(0);
  const boxRemovalCounts = new Map<number, number>();
  const spatialRegionCounts = new Map<number, number>();
  const boxesPerRow = size / boxDims.cols;
  for (let i = 0; i < boxesPerRow * boxesPerRow; i++) {
    boxRemovalCounts.set(i, 0);
  }
  // Initialize spatial regions (9 regions for better distribution)
  for (let i = 0; i < 9; i++) {
    spatialRegionCounts.set(i, 0);
  }

  // Track which rows, columns, and boxes already have at least one removal
  const rowsWithRemovals = new Set<number>();
  const colsWithRemovals = new Set<number>();
  const boxesWithRemovals = new Set<number>();

  /**
   * Helper function to remove a cell and update tracking
   */
  const removeCell = (row: number, col: number): void => {
    const key = `${row},${col}`;
    if (removedCells.has(key)) return;

    puzzle[row][col] = 0;
    removedCells.add(key);

    rowRemovalCounts[row]++;
    colRemovalCounts[col]++;
    const boxIdx = getBoxIndex(row, col, boxDims, size);
    boxRemovalCounts.set(boxIdx, (boxRemovalCounts.get(boxIdx) || 0) + 1);

    const spatialRegion = getSpatialRegion(row, col, size);
    spatialRegionCounts.set(spatialRegion, (spatialRegionCounts.get(spatialRegion) || 0) + 1);

    rowsWithRemovals.add(row);
    colsWithRemovals.add(col);
    boxesWithRemovals.add(boxIdx);
  };

  /**
   * Helper function to get cell priority for balanced distribution
   * Lower priority means the cell is in an area that needs more removals
   * Now includes spatial region distribution for better top/bottom/left/right balance
   */
  const getCellPriority = (row: number, col: number): number => {
    const boxIdx = getBoxIndex(row, col, boxDims, size);
    const rowCount = rowRemovalCounts[row];
    const colCount = colRemovalCounts[col];
    const boxCount = boxRemovalCounts.get(boxIdx) || 0;
    const spatialRegion = getSpatialRegion(row, col, size);
    const spatialCount = spatialRegionCounts.get(spatialRegion) || 0;

    // Priority based on current removal counts (lower count = higher priority)
    // Include spatial region to ensure top/bottom/left/right balance
    // Weight spatial region more heavily to prevent clustering
    return rowCount + colCount + boxCount + (spatialCount * 1.5);
  };

  // Step 1: Ensure each row has at least one empty cell
  for (let row = 0; row < size; row++) {
    if (!rowsWithRemovals.has(row)) {
      const availableCols: [number, number][] = [];
      for (let col = 0; col < size; col++) {
        const key = `${row},${col}`;
        if (!removedCells.has(key)) {
          availableCols.push([col, getCellPriority(row, col)]);
        }
      }

      if (availableCols.length > 0) {
        // Prefer cells that are in columns/boxes with fewer removals
        availableCols.sort((a, b) => a[1] - b[1]);
        // Randomly pick from the top 3 priority options (or all if less than 3)
        const topOptions = availableCols.slice(0, Math.min(3, availableCols.length));
        const [randomCol] = topOptions[Math.floor(Math.random() * topOptions.length)];
        removeCell(row, randomCol);
      }
    }
  }

  // Step 2: Ensure each column has at least one empty cell
  for (let col = 0; col < size; col++) {
    if (!colsWithRemovals.has(col)) {
      const availableRows: [number, number][] = [];
      for (let row = 0; row < size; row++) {
        const key = `${row},${col}`;
        if (!removedCells.has(key)) {
          availableRows.push([row, getCellPriority(row, col)]);
        }
      }

      if (availableRows.length > 0) {
        // Prefer cells that are in rows/boxes with fewer removals
        availableRows.sort((a, b) => a[1] - b[1]);
        const topOptions = availableRows.slice(0, Math.min(3, availableRows.length));
        const [randomRow] = topOptions[Math.floor(Math.random() * topOptions.length)];
        removeCell(randomRow, col);
      }
    }
  }

  // Step 3: Ensure each box has at least one empty cell
  for (let boxIdx = 0; boxIdx < boxesPerRow * boxesPerRow; boxIdx++) {
    if (!boxesWithRemovals.has(boxIdx)) {
      const boxRow = Math.floor(boxIdx / boxesPerRow);
      const boxCol = boxIdx % boxesPerRow;
      const startRow = boxRow * boxDims.rows;
      const startCol = boxCol * boxDims.cols;

      const availableCells: [number, number, number][] = [];
      for (let i = 0; i < boxDims.rows; i++) {
        for (let j = 0; j < boxDims.cols; j++) {
          const row = startRow + i;
          const col = startCol + j;
          const key = `${row},${col}`;
          if (!removedCells.has(key)) {
            availableCells.push([row, col, getCellPriority(row, col)]);
          }
        }
      }

      if (availableCells.length > 0) {
        // Prefer cells that are in rows/columns with fewer removals
        availableCells.sort((a, b) => a[2] - b[2]);
        const topOptions = availableCells.slice(0, Math.min(3, availableCells.length));
        const [randomRow, randomCol] = topOptions[Math.floor(Math.random() * topOptions.length)];
        removeCell(randomRow, randomCol);
      }
    }
  }

  // Step 4: Remove additional cells to reach target difficulty with balanced distribution
  const currentRemoved = removedCells.size;
  const additionalToRemove = Math.max(0, targetCellsToRemove - currentRemoved);

  if (additionalToRemove > 0) {
    // Use a multi-factor round-robin approach to ensure even distribution
    // Group by both spatial region AND column to balance columns evenly
    const positionsByColumn = new Map<number, [number, number, number, number][]>();
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const key = `${i},${j}`;
        if (!removedCells.has(key)) {
          const priority = getCellPriority(i, j);
          const spatialRegion = getSpatialRegion(i, j, size);
          if (!positionsByColumn.has(j)) {
            positionsByColumn.set(j, []);
          }
          positionsByColumn.get(j)!.push([i, j, priority, spatialRegion]);
        }
      }
    }

    // Sort positions within each column by priority (and spatial region as tiebreaker)
    for (const positions of positionsByColumn.values()) {
      positions.sort((a, b) => {
        if (a[2] !== b[2]) return a[2] - b[2]; // Priority first
        return a[3] - b[3]; // Spatial region as tiebreaker
      });
    }

    // Round-robin by column AND spatial region for maximum balance
    const cellsToRemoveNow = Math.min(additionalToRemove,
      Array.from(positionsByColumn.values()).reduce((sum, arr) => sum + arr.length, 0));

    // Create a map of columns with their current removal counts for round-robin ordering
    const columnOrder: number[] = [];
    for (let col = 0; col < size; col++) {
      columnOrder.push(col);
    }
    // Sort columns by current removal count (fewer removals = higher priority)
    columnOrder.sort((a, b) => colRemovalCounts[a] - colRemovalCounts[b]);

    let removedCount = 0;
    let round = 0;

    while (removedCount < cellsToRemoveNow) {
      let foundAny = false;

      // Go through columns in priority order (those with fewer removals first)
      for (const col of columnOrder) {
        if (removedCount >= cellsToRemoveNow) break;

        const columnPositions = positionsByColumn.get(col);
        if (!columnPositions || columnPositions.length === 0) continue;

        // Find the best position from this column considering spatial distribution
        // Prefer positions in spatial regions that have fewer removals in this round
        let bestIndex = 0;
        let bestPriority = columnPositions[0][2];
        let bestSpatialRegion = columnPositions[0][3];

        // Within this column, prefer positions in spatial regions with fewer removals
        for (let idx = 0; idx < Math.min(columnPositions.length, 5); idx++) {
          const [, , priority, spatialRegion] = columnPositions[idx];
          const spatialCount = spatialRegionCounts.get(spatialRegion) || 0;

          // Prefer lower priority and lower spatial region count
          if (priority < bestPriority ||
              (priority === bestPriority && spatialCount < (spatialRegionCounts.get(bestSpatialRegion) || 0))) {
            bestIndex = idx;
            bestPriority = priority;
            bestSpatialRegion = spatialRegion;
          }
        }

        const [row, removedCol] = columnPositions.splice(bestIndex, 1)[0];
        removeCell(row, removedCol);
        removedCount++;
        foundAny = true;

        // Re-sort column order after each removal to maintain balance
        columnOrder.sort((a, b) => colRemovalCounts[a] - colRemovalCounts[b]);
      }

      // If no positions found, break to avoid infinite loop
      if (!foundAny) break;
      round++;
    }

    // If we still need more removals, use the standard priority-based approach
    if (removedCount < cellsToRemoveNow) {
      const remainingPositions: [number, number, number][] = [];
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const key = `${i},${j}`;
          if (!removedCells.has(key)) {
            remainingPositions.push([i, j, getCellPriority(i, j)]);
          }
        }
      }

      remainingPositions.sort((a, b) => a[2] - b[2]);
      const stillNeed = cellsToRemoveNow - removedCount;
      for (let i = 0; i < Math.min(stillNeed, remainingPositions.length); i++) {
        const [row, col] = remainingPositions[i];
        removeCell(row, col);
      }
    }
  }

  return puzzle;
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Gets valid sizes for a given Sudoku type
 */
export function getValidSizes(type: string): number[] {
  if (type === 'general') {
    return [4, 6, 9];
  }
  // For other types, default to 9x9 for now
  return [9];
}

