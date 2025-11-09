# Sudoku Puzzle Generator

A web application to generate Sudoku puzzles for printing. Built with React, TypeScript, and Tailwind CSS. Perfect for kids and adults!

## Features

- **Classic Sudoku Focus**: General puzzles built with the standard Sudoku rules
- **Flexible Grid Sizes**: 4×4, 6×6, or 9×9 (default 9×9)
- **Four Difficulty Levels**:
  - **Easy**: Kids Easy - 65% filled (perfect for children)
  - **Medium**: Adult Easy - 40% filled (industry standard easy)
  - **Hard**: Adult Medium - 34% filled (industry standard medium)
  - **Extremely Hard**: Adult Hard - 28% filled (industry standard hard)
- **No Login Required**: Generate unlimited puzzles for free
- **Printable Pages**: Generate printable HTML pages optimized for printing
- **Answer Key**: View solutions with a click (answers don't print)
- **Even Distribution**: Puzzles are carefully balanced across rows, columns, and boxes

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **jsPDF** - PDF generation

## Getting Started

### Prerequisites

- Node.js 22.x and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Usage

1. Choose a grid size (4×4, 6×6, or 9×9)
2. Select a difficulty level
3. Click "Generate Printable Sudoku" to open a printable page
4. Use "Show Answer" to view the solution (won't print)
5. Print using your browser's print function (Ctrl+P / Cmd+P)

## Deployment

### Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy via Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite configuration
   - Click "Deploy"

3. **Or use Vercel CLI**:
   ```bash
   npm i -g vercel
   vercel
   ```

The `vercel.json` file is already configured for optimal deployment.

## Project Structure

```
├── src/
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # React entry point
│   ├── index.css            # Tailwind CSS imports
│   ├── types.ts             # TypeScript type definitions
│   └── utils/
│       ├── sudokuGenerator.ts    # Sudoku generation logic
│       └── printableGenerator.ts # Printable HTML page generation
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── vercel.json              # Vercel deployment configuration
```

## Development

This project follows static web app principles:
- Client-side only (no server required)
- Generates PDFs entirely in the browser
- No external API calls
- Privacy-friendly (no data collection)

## License

MIT
