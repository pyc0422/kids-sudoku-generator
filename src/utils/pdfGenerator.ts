import { jsPDF } from 'jspdf';
import type { Grid, SudokuType, Difficulty } from '../types';

/**
 * Generates a PDF from a Sudoku puzzle
 */
export function generateSudokuPDF(puzzle: Grid, size: number, type: SudokuType, difficulty: Difficulty): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const gridSize = pageWidth - (2 * margin);
  const cellSize = gridSize / size;

  // Title
  doc.setFontSize(18);
  doc.text('Sudoku Puzzle', pageWidth / 2, 30, { align: 'center' });

  // Subtitle with type and difficulty
  doc.setFontSize(12);
  const subtitle = `${type.charAt(0).toUpperCase() + type.slice(1)} - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`;
  doc.text(subtitle, pageWidth / 2, 40, { align: 'center' });

  // Get box dimensions
  let boxRows: number;
  let boxCols: number;
  if (size === 9) {
    boxRows = 3;
    boxCols = 3;
  } else if (size === 6) {
    boxRows = 2;
    boxCols = 3;
  } else if (size === 4) {
    boxRows = 2;
    boxCols = 2;
  } else {
    const boxSize = Math.sqrt(size);
    boxRows = boxSize;
    boxCols = boxSize;
  }

  // Draw grid
  const startY = 50;
  const startX = margin;

  // Draw all cell borders first (light lines)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.1);
  for (let i = 0; i <= size; i++) {
    // Vertical lines
    const x = startX + (i * cellSize);
    doc.line(x, startY, x, startY + gridSize);
    // Horizontal lines
    const y = startY + (i * cellSize);
    doc.line(startX, y, startX + gridSize, y);
  }

  // Draw thicker borders for box boundaries
  doc.setLineWidth(0.5);
  const boxesPerRow = size / boxCols;
  const boxesPerCol = size / boxRows;

  // Vertical box boundaries
  for (let i = 0; i <= boxesPerRow; i++) {
    const x = startX + (i * boxCols * cellSize);
    doc.line(x, startY, x, startY + gridSize);
  }

  // Horizontal box boundaries
  for (let i = 0; i <= boxesPerCol; i++) {
    const y = startY + (i * boxRows * cellSize);
    doc.line(startX, y, startX + gridSize, y);
  }

  // Draw numbers
  let fontSize = 14;
  if (size === 6) fontSize = 16;
  else if (size === 4) fontSize = 18;
  doc.setFontSize(fontSize);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (puzzle[i][j] !== 0) {
        const x = startX + (j * cellSize) + cellSize / 2;
        const y = startY + (i * cellSize) + cellSize / 2 + 2;
        doc.text(
          puzzle[i][j].toString(),
          x,
          y,
          { align: 'center', baseline: 'middle' } as any
        );
      }
    }
  }

  // Save PDF
  const filename = `sudoku-${type}-${size}x${size}-${difficulty}.pdf`;
  doc.save(filename);
}

