import { useState } from 'react'
import { generateSudoku, createPuzzle} from './utils/sudokuGenerator'
import { generatePrintablePage } from './utils/printableGenerator'
import type { Difficulty, DifficultyOption } from './types'

function App() {

  const [size, setSize] = useState<number>(9)
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [isGenerating, setIsGenerating] = useState<boolean>(false)

  const difficulties: DifficultyOption[] = [
    { value: 'easy', label: 'Easy (Kids Easy - 65% filled)', percent: 65 },
    { value: 'medium', label: 'Medium (Adult Easy - 40% filled)', percent: 40 },
    { value: 'hard', label: 'Hard (Adult Medium - 34% filled)', percent: 34 },
    { value: 'extremely hard', label: 'Extremely Hard (Adult Hard - 28% filled)', percent: 28 },
  ]

  const validSizes = [4, 6, 9]
  const handleGenerate = (): void => {
    setIsGenerating(true)

    // Generate in next tick to allow UI to update
    setTimeout(() => {
      try {
        // Generate complete Sudoku
        const completeGrid = generateSudoku(size)

        // Create puzzle by removing cells based on difficulty
        const puzzle = createPuzzle(completeGrid, size, difficulty)

        // Generate printable page (pass both puzzle and solution)
        generatePrintablePage(puzzle, completeGrid, size, difficulty)
      } catch (error) {
        console.error('Error generating Sudoku:', error)
        alert('Error generating Sudoku. Please try again.')
      } finally {
        setIsGenerating(false)
      }
    }, 0)
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
            Sudoku Puzzle Generator
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Generate custom Sudoku puzzles for printing
          </p>

          <div className="space-y-6">
              <div>
                <label htmlFor="grid-size" className="block text-sm font-semibold text-gray-700 mb-2">
                  Grid Size
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {validSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`px-4 py-3 rounded-lg font-medium transition-all ${
                        size === s
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {s}×{s}
                    </button>
                  ))}
                </div>
              </div>


            {/* Difficulty Selection */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-semibold text-gray-700 mb-2">
                Difficulty Level
              </label>
              <div className="space-y-2">
                {difficulties.map((diff) => (
                  <button
                    key={diff.value}
                    onClick={() => setDifficulty(diff.value)}
                    className={`w-full px-4 py-3 rounded-lg font-medium text-left transition-all ${
                      difficulty === diff.value
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="font-semibold">{diff.label.split(' ')[0]}</span>
                    <span className="ml-2 text-sm opacity-90">
                      {diff.label.substring(diff.label.indexOf('('))}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-4 rounded-lg font-bold text-white text-lg transition-all ${
                isGenerating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
            >
              {isGenerating ? 'Generating...' : 'Generate Printable Sudoku'}
            </button>
          </div>

          {/* Info Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              No login required. Generate unlimited Sudoku puzzles for free!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

