// Type definitions for Sudoku Generator

export type SudokuType = 'general' | 'kill' | 'diagram';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'extremely hard';

export type Grid = number[][];

export interface BoxDimensions {
  rows: number;
  cols: number;
}

export interface DifficultyOption {
  value: Difficulty;
  label: string;
  percent: number;
}

