import React from 'react';
import Cell from './Cell';
import { Column as ColumnType, GameSettings } from '../types/gameTypes';

interface ColumnProps {
  column: ColumnType;
  columnIndex: number;
  onColumnClick: (colIndex: number) => void;
  isActive: boolean;
  winningCells: [number, number][] | null;
  lastColumn: number | null;
  isDropping: boolean;
  settings: GameSettings;
  theme: 'light' | 'dark';
}

const Column: React.FC<ColumnProps> = ({ 
  column, 
  columnIndex, 
  onColumnClick, 
  isActive,
  winningCells,
  lastColumn,
  isDropping,
  settings,
  theme
}) => {
  const isColumnFull = !column.some(cell => cell === null);
  
  const handleClick = () => {
    if (!isColumnFull && isActive) {
      onColumnClick(columnIndex);
    }
  };

  return (
    <div 
      className={`
        flex flex-col-reverse w-full transition-colors duration-300
        gap-0.5 sm:gap-1
        ${isColumnFull ? 'cursor-not-allowed' : 
          isActive ? 'cursor-pointer hover:bg-slate-100/50 rounded-t-lg' : 
          'cursor-not-allowed'}
      `}
      onClick={handleClick}
    >
      {column.map((cell, rowIndex) => {
        const isWinningCell = winningCells?.some(
          ([col, row]) => col === columnIndex && row === rowIndex
        ) || false;
        
        const isAnimating =
          isDropping && columnIndex === lastColumn && cell !== null;
        const staggerDelay = isAnimating ? rowIndex * 0.07 : 0;
        
        return (
          <Cell 
            key={rowIndex}
            value={cell}
            isWinningCell={isWinningCell}
            isAnimating={isAnimating}
            staggerDelay={staggerDelay}
            settings={settings}
            theme={theme}
          />
        );
      })}
    </div>
  );
};

export default Column;