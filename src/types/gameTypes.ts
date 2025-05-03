export type Player = 1 | 2;
export type CellValue = Player | null;
export type Column = CellValue[];
export type GameBoard = Column[];
export type PlayerColor = 'red' | 'blue' | 'green' | 'yellow';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameSettings {
  playerColor: PlayerColor;
  aiColor: PlayerColor;
  difficulty: Difficulty;
}

export interface GameState {
  board: GameBoard;
  currentPlayer: Player;
  gameOver: boolean;
  winner: Player | null;
  isDraw: boolean;
  playerScore: number;
  aiScore: number;
  winningCells: [number, number][] | null;
  isDropping: boolean;
  lastColumn: number | null;
  isThinking: boolean;
  settings: GameSettings;
}

export type GameAction = 
  | { type: 'DROP_PIECE'; column: number }
  | { type: 'START_DROPPING'; column: number }
  | { type: 'END_DROPPING' }
  | { type: 'START_AI_THINKING' }
  | { type: 'END_AI_THINKING' }
  | { type: 'RESET_GAME' };