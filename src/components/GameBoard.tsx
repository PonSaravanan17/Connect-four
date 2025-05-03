import React from 'react';
import Column from './Column';
import { GameBoard as GameBoardType, GameState } from '../types/gameTypes';

interface GameBoardProps {
  board: GameBoardType;
  onColumnClick: (columnIndex: number) => void;
  gameState: GameState;
  theme: 'light' | 'dark';
}

const GameBoard: React.FC<GameBoardProps> = ({ board, onColumnClick, gameState, theme }) => {
  const { currentPlayer, gameOver, winningCells, isDropping, lastColumn, settings } = gameState;
  const boardBg = theme === 'dark' ? 'bg-blue-900' : 'bg-blue-700';
  const innerBg = theme === 'dark' ? 'bg-blue-950' : 'bg-blue-800';
  
  return (
    <div className="w-full max-w-xs sm:max-w-md md:max-w-xl mx-auto">
      <div className={`${boardBg} p-2 sm:p-4 rounded-2xl shadow-lg transition-colors duration-500`}>
        <div className={`flex ${innerBg} rounded-xl overflow-hidden transition-colors duration-500 gap-0.5 sm:gap-1`}>
          {board.map((column, columnIndex) => (
            <Column
              key={columnIndex}
              column={column}
              columnIndex={columnIndex}
              onColumnClick={onColumnClick}
              isActive={!gameOver && !isDropping}
              winningCells={winningCells}
              lastColumn={lastColumn}
              isDropping={isDropping}
              settings={settings}
              theme={theme}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;