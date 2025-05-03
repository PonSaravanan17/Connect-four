import { useReducer, useEffect } from 'react';
import { GameState, GameAction, GameSettings } from '../types/gameTypes';
import { initGameState, dropPiece, checkForWin, checkForDraw, findEmptyRowInColumn } from '../utils/gameUtils';
import { getBestMove } from '../utils/aiUtils';

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'DROP_PIECE': {
      const { column } = action;
      const rowIndex = findEmptyRowInColumn(state.board, column);
      
      if (state.gameOver || rowIndex === null) {
        return state;
      }
      
      const newBoard = dropPiece(state.board, column, state.currentPlayer);
      const winningCells = checkForWin(newBoard, column, rowIndex);
      const isDraw = !winningCells && checkForDraw(newBoard);
      
      let playerScore = state.playerScore;
      let aiScore = state.aiScore;
      
      if (winningCells && state.currentPlayer === 1) {
        playerScore += 1;
      } else if (winningCells && state.currentPlayer === 2) {
        aiScore += 1;
      }
      
      return {
        ...state,
        board: newBoard,
        currentPlayer: state.currentPlayer === 1 ? 2 : 1,
        gameOver: !!winningCells || isDraw,
        winner: winningCells ? state.currentPlayer : null,
        isDraw,
        playerScore,
        aiScore,
        winningCells,
        lastColumn: column,
      };
    }
    
    case 'START_DROPPING':
      return {
        ...state,
        isDropping: true,
        lastColumn: action.column
      };
      
    case 'END_DROPPING':
      return {
        ...state,
        isDropping: false
      };
      
    case 'START_AI_THINKING':
      return {
        ...state,
        isThinking: true
      };
      
    case 'END_AI_THINKING':
      return {
        ...state,
        isThinking: false
      };
    
    case 'RESET_GAME':
      return {
        ...initGameState(state.settings),
        playerScore: state.playerScore,
        aiScore: state.aiScore,
        settings: state.settings
      };
    
    default:
      return state;
  }
};

export const useConnect4Game = (settings: GameSettings | null) => {
  const [gameState, dispatch] = useReducer(gameReducer, null, () => {
    if (!settings) {
      return initGameState({
        playerColor: 'red',
        aiColor: 'blue',
        difficulty: 'medium'
      });
    }
    return initGameState(settings);
  });
  
  const handlePlayerMove = (column: number) => {
    if (gameState.gameOver || gameState.currentPlayer !== 1 || gameState.isDropping) {
      return;
    }
    
    const rowIndex = findEmptyRowInColumn(gameState.board, column);
    if (rowIndex === null) {
      return;
    }
    
    dispatch({ type: 'START_DROPPING', column });
    
    setTimeout(() => {
      dispatch({ type: 'END_DROPPING' });
      dispatch({ type: 'DROP_PIECE', column });
    }, 500);
  };
  
  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };
  
  useEffect(() => {
    let timeoutId: number;
    
    if (gameState.currentPlayer === 2 && !gameState.gameOver) {
      dispatch({ type: 'START_AI_THINKING' });
      
      timeoutId = setTimeout(() => {
        dispatch({ type: 'END_AI_THINKING' });
        const aiMove = getBestMove(gameState.board, gameState.settings.difficulty);
        
        dispatch({ type: 'START_DROPPING', column: aiMove });
        
        setTimeout(() => {
          dispatch({ type: 'END_DROPPING' });
          dispatch({ type: 'DROP_PIECE', column: aiMove });
        }, 500);
      }, 1000);
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [gameState.currentPlayer, gameState.gameOver, gameState.settings.difficulty]);
  
  return {
    gameState,
    handlePlayerMove,
    resetGame
  };
};