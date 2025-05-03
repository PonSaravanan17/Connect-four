import { GameBoard, Player, Difficulty } from '../types/gameTypes';
import { COLS, ROWS, findEmptyRowInColumn, dropPiece, checkForWin } from './gameUtils';

const getDifficultyDepth = (difficulty: Difficulty): number => {
  switch (difficulty) {
    case 'easy': return 2;
    case 'medium': return 4;
    case 'hard': return 6;
    default: return 2;
  }
};

const evaluateWindow = (window: (Player | null)[], player: Player): number => {
  const opponent = player === 1 ? 2 : 1;
  let score = 0;
  
  const playerCount = window.filter(piece => piece === player).length;
  const opponentCount = window.filter(piece => piece === opponent).length;
  const emptyCount = window.filter(piece => piece === null).length;
  
  if (playerCount === 4) return 100;
  if (playerCount === 3 && emptyCount === 1) score += 5;
  if (playerCount === 2 && emptyCount === 2) score += 2;
  
  if (opponentCount === 3 && emptyCount === 1) score -= 4;
  
  return score;
};

const scorePosition = (board: GameBoard, player: Player): number => {
  let score = 0;
  
  const centerColumn = Math.floor(COLS / 2);
  const centerArray = board[centerColumn];
  const centerCount = centerArray.filter(piece => piece === player).length;
  score += centerCount * 3;
  
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const window = [
        board[c][r],
        board[c+1][r],
        board[c+2][r],
        board[c+3][r]
      ];
      score += evaluateWindow(window, player);
    }
  }
  
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS - 3; r++) {
      const window = [
        board[c][r],
        board[c][r+1],
        board[c][r+2],
        board[c][r+3]
      ];
      score += evaluateWindow(window, player);
    }
  }
  
  for (let c = 0; c < COLS - 3; c++) {
    for (let r = 0; r < ROWS - 3; r++) {
      const window = [
        board[c][r],
        board[c+1][r+1],
        board[c+2][r+2],
        board[c+3][r+3]
      ];
      score += evaluateWindow(window, player);
    }
  }
  
  for (let c = 0; c < COLS - 3; c++) {
    for (let r = 3; r < ROWS; r++) {
      const window = [
        board[c][r],
        board[c+1][r-1],
        board[c+2][r-2],
        board[c+3][r-3]
      ];
      score += evaluateWindow(window, player);
    }
  }
  
  return score;
};

const isWinningMove = (board: GameBoard, column: number, player: Player): boolean => {
  if (!isValidMove(board, column)) return false;
  
  const rowIndex = findEmptyRowInColumn(board, column);
  if (rowIndex === null) return false;
  
  const newBoard = dropPiece(board, column, player);
  return checkForWin(newBoard, column, rowIndex) !== null;
};

const isValidMove = (board: GameBoard, column: number): boolean => {
  return column >= 0 && column < COLS && findEmptyRowInColumn(board, column) !== null;
};

const getValidMoves = (board: GameBoard): number[] => {
  const validMoves: number[] = [];
  for (let col = 0; col < COLS; col++) {
    if (isValidMove(board, col)) {
      validMoves.push(col);
    }
  }
  return validMoves;
};

const minimax = (
  board: GameBoard,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  player: Player
): [number, number | null] => {
  const opponent = player === 1 ? 2 : 1;
  const validMoves = getValidMoves(board);
  
  if (depth === 0 || validMoves.length === 0) {
    return [scorePosition(board, player), null];
  }
  
  for (const col of validMoves) {
    if (isWinningMove(board, col, player)) {
      return [1000, col];
    }
  }
  
  for (const col of validMoves) {
    if (isWinningMove(board, col, opponent)) {
      return [800, col];
    }
  }
  
  if (isMaximizing) {
    let value = -Infinity;
    let column: number | null = validMoves[0];
    
    for (const col of validMoves) {
      const rowIndex = findEmptyRowInColumn(board, col);
      if (rowIndex === null) continue;
      
      const newBoard = dropPiece(board, col, player);
      const [newScore] = minimax(newBoard, depth - 1, alpha, beta, false, player);
      
      if (newScore > value) {
        value = newScore;
        column = col;
      }
      
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    
    return [value, column];
  } else {
    let value = Infinity;
    let column: number | null = validMoves[0];
    
    for (const col of validMoves) {
      const rowIndex = findEmptyRowInColumn(board, col);
      if (rowIndex === null) continue;
      
      const newBoard = dropPiece(board, col, opponent);
      const [newScore] = minimax(newBoard, depth - 1, alpha, beta, true, player);
      
      if (newScore < value) {
        value = newScore;
        column = col;
      }
      
      beta = Math.min(beta, value);
      if (alpha >= beta) break;
    }
    
    return [value, column];
  }
};

export const getBestMove = (board: GameBoard, difficulty: Difficulty): number => {
  const player: Player = 2;
  const validMoves = getValidMoves(board);
  
  if (validMoves.length === 1) {
    return validMoves[0];
  }
  
  for (const col of validMoves) {
    if (isWinningMove(board, col, player)) {
      return col;
    }
  }
  
  if (difficulty === 'easy' && Math.random() < 0.3) {
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }
  
  for (const col of validMoves) {
    if (isWinningMove(board, col, 1)) {
      return col;
    }
  }
  
  const depth = getDifficultyDepth(difficulty);
  const [_, column] = minimax(board, depth, -Infinity, Infinity, true, player);
  
  return column !== null ? column : validMoves[Math.floor(Math.random() * validMoves.length)];
};