import { GameBoard, Player, GameState, GameSettings } from '../types/gameTypes';

export const ROWS = 6;
export const COLS = 7;

export const createEmptyBoard = (): GameBoard => {
  return Array(COLS).fill(null).map(() => Array(ROWS).fill(null));
};

export const initGameState = (settings: GameSettings): GameState => {
  return {
    board: createEmptyBoard(),
    currentPlayer: 1, // Player starts
    gameOver: false,
    winner: null,
    isDraw: false,
    playerScore: 0,
    aiScore: 0,
    winningCells: null,
    isDropping: false,
    lastColumn: null,
    isThinking: false,
    settings
  };
};

export const findEmptyRowInColumn = (board: GameBoard, columnIndex: number): number | null => {
  const column = board[columnIndex];
  for (let rowIndex = 0; rowIndex < column.length; rowIndex++) {
    if (column[rowIndex] === null) {
      return rowIndex;
    }
  }
  return null; // Column is full
};

export const isValidMove = (board: GameBoard, columnIndex: number): boolean => {
  if (columnIndex < 0 || columnIndex >= board.length) {
    return false;
  }
  return findEmptyRowInColumn(board, columnIndex) !== null;
};

export const dropPiece = (board: GameBoard, columnIndex: number, player: Player): GameBoard => {
  if (!isValidMove(board, columnIndex)) {
    return board;
  }

  const newBoard = board.map(column => [...column]);
  const rowIndex = findEmptyRowInColumn(newBoard, columnIndex)!;
  newBoard[columnIndex][rowIndex] = player;
  
  return newBoard;
};

export const checkForWin = (board: GameBoard, lastCol: number, lastRow: number): [number, number][] | null => {
  const player = board[lastCol][lastRow];
  if (player === null) return null;
  
  // Define direction vectors: horizontal, vertical, diagonal1, diagonal2
  const directions = [
    [0, 1], // vertical
    [1, 0], // horizontal
    [1, 1], // diagonal down-right
    [1, -1], // diagonal up-right
  ];
  
  for (const [dx, dy] of directions) {
    const winningCells: [number, number][] = [];
    
    // Check in both positive and negative directions
    for (let i = -3; i <= 3; i++) {
      const col = lastCol + i * dx;
      const row = lastRow + i * dy;
      
      if (col >= 0 && col < COLS && row >= 0 && row < ROWS && board[col][row] === player) {
        winningCells.push([col, row]);
        
        // If we found 4 in a row, return the winning cells
        if (winningCells.length === 4) {
          return winningCells;
        }
      } else {
        // Reset the count if the chain is broken
        winningCells.length = 0;
      }
    }
  }
  
  return null;
};

export const checkForDraw = (board: GameBoard): boolean => {
  // Check if the board is full
  return board.every(column => column.every(cell => cell !== null));
};