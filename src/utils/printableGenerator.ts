import type { Grid, SudokuType, Difficulty } from '../types';

/**
 * Gets box dimensions for a given grid size
 */
function getBoxDimensions(size: number): { rows: number; cols: number } {
  if (size === 9) return { rows: 3, cols: 3 };
  if (size === 6) return { rows: 2, cols: 3 };
  if (size === 4) return { rows: 2, cols: 2 };
  const boxSize = Math.sqrt(size);
  return { rows: boxSize, cols: boxSize };
}

/**
 * Generates a printable HTML page from a Sudoku puzzle
 */
export function generatePrintablePage(
  puzzle: Grid,
  solution: Grid,
  size: number,
  type: SudokuType,
  difficulty: Difficulty
): void {
  const boxDims = getBoxDimensions(size);
  const html = generateHTML(puzzle, solution, size, type, difficulty, boxDims);

  // Create a new window with the printable content
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print the Sudoku puzzle');
    return;
  }

  printWindow.document.write(html);
  printWindow.document.close();

  // Wait for content to load, then trigger print dialog
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 100);
  };
}

function generateHTML(
  puzzle: Grid,
  solution: Grid,
  size: number,
  type: SudokuType,
  difficulty: Difficulty,
  boxDims: { rows: number; cols: number }
): string {
  const title = 'Sudoku Puzzle';
  const subtitle = `${type.charAt(0).toUpperCase() + type.slice(1)} - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`;

  const cellSize = size === 9 ? '50px' : size === 6 ? '60px' : '70px';
  const fontSize = size === 9 ? '24px' : size === 6 ? '28px' : '32px';

  let gridHTML = '';

  // Generate puzzle grid cells
  for (let i = 0; i < size; i++) {
    gridHTML += '<tr>';
    for (let j = 0; j < size; j++) {
      const cellValue = puzzle[i][j];
      const isBoxTop = i % boxDims.rows === 0;
      const isBoxLeft = j % boxDims.cols === 0;

      let cellClass = 'sudoku-cell';
      if (isBoxTop) cellClass += ' box-top';
      if (isBoxLeft) cellClass += ' box-left';

      gridHTML += `<td class="${cellClass}">${cellValue !== 0 ? cellValue : ''}</td>`;
    }
    gridHTML += '</tr>';
  }

  let answerGridHTML = '';

  // Generate answer grid cells
  for (let i = 0; i < size; i++) {
    answerGridHTML += '<tr>';
    for (let j = 0; j < size; j++) {
      const cellValue = solution[i][j];
      const isBoxTop = i % boxDims.rows === 0;
      const isBoxLeft = j % boxDims.cols === 0;

      let cellClass = 'sudoku-cell';
      if (isBoxTop) cellClass += ' box-top';
      if (isBoxLeft) cellClass += ' box-left';

      answerGridHTML += `<td class="${cellClass}">${cellValue}</td>`;
    }
    answerGridHTML += '</tr>';
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    @media print {
      @page {
        margin: 1cm;
        size: A4;
      }

      body {
        margin: 0;
        padding: 20px;
      }

      .no-print {
        display: none !important;
      }

      .answer-section {
        display: none !important;
      }
    }

    body {
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      background: white;
    }

    .title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 5px;
      text-align: center;
    }

    .subtitle {
      font-size: 16px;
      margin-bottom: 30px;
      text-align: center;
      color: #666;
    }

    .sudoku-grid {
      border-collapse: collapse;
      border: 3px solid #000;
      margin: 0 auto;
    }

    .sudoku-cell {
      width: ${cellSize};
      height: ${cellSize};
      border: 1px solid #ccc;
      text-align: center;
      vertical-align: middle;
      font-size: ${fontSize};
      font-weight: bold;
      padding: 0;
      box-sizing: border-box;
    }

    .sudoku-cell.box-top {
      border-top-width: 2px;
      border-top-color: #000;
    }

    .sudoku-cell.box-left {
      border-left-width: 2px;
      border-left-color: #000;
    }

    .sudoku-grid tr:first-child .sudoku-cell {
      border-top-width: 3px;
    }

    .sudoku-grid tr:last-child .sudoku-cell {
      border-bottom-width: 3px;
      border-bottom-color: #000;
    }

    .sudoku-grid tr .sudoku-cell:first-child {
      border-left-width: 3px;
    }

    .sudoku-grid tr .sudoku-cell:last-child {
      border-right-width: 3px;
      border-right-color: #000;
    }

    .no-print {
      margin-top: 30px;
      padding: 15px;
      background: #f0f0f0;
      border-radius: 5px;
      text-align: center;
    }

    .print-button {
      background: #4CAF50;
      color: white;
      border: none;
      padding: 12px 24px;
      font-size: 16px;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 10px;
    }

    .print-button:hover {
      background: #45a049;
    }

    .answer-link {
      color: #2196F3;
      text-decoration: underline;
      cursor: pointer;
      margin-left: 10px;
      font-size: 14px;
    }

    .answer-link:hover {
      color: #0b7dda;
    }

    .answer-section {
      margin-top: 40px;
      padding: 20px;
      background: #f9f9f9;
      border: 2px dashed #ccc;
      border-radius: 8px;
      display: none;
    }

    .answer-section.show {
      display: block;
    }

    .answer-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 15px;
      text-align: center;
      color: #333;
    }

    .hide-answer {
      display: block;
      margin-top: 15px;
      text-align: center;
    }

    .hide-button {
      background: #f44336;
      color: white;
      border: none;
      padding: 8px 16px;
      font-size: 14px;
      border-radius: 5px;
      cursor: pointer;
    }

    .hide-button:hover {
      background: #da190b;
    }
  </style>
  <script>
    function toggleAnswer() {
      const answerSection = document.getElementById('answer-section');
      const answerLink = document.getElementById('answer-link');
      if (answerSection.classList.contains('show')) {
        answerSection.classList.remove('show');
        answerLink.textContent = 'Show Answer';
      } else {
        answerSection.classList.add('show');
        answerLink.textContent = 'Hide Answer';
      }
    }
  </script>
</head>
<body>
  <div class="title">${title}</div>
  <div class="subtitle">${subtitle}</div>

  <table class="sudoku-grid">
    ${gridHTML}
  </table>

  <div class="no-print">
    <p>Use your browser's print function (Ctrl+P / Cmd+P) to print this page</p>
    <button class="print-button" onclick="window.print()">Print Puzzle</button>
    <span id="answer-link" class="answer-link" onclick="toggleAnswer()">Show Answer</span>
  </div>

  <div id="answer-section" class="answer-section no-print">
    <div class="answer-title">Solution</div>
    <table class="sudoku-grid">
      ${answerGridHTML}
    </table>
    <div class="hide-answer">
      <button class="hide-button" onclick="toggleAnswer()">Hide Answer</button>
    </div>
  </div>
</body>
</html>`;
}

