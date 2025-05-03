import React, { useEffect } from 'react';
import { CellValue, GameSettings } from '../types/gameTypes';
import { motion } from 'framer-motion';
import { playSound } from '../utils/soundUtils';

const colorClassMap: Record<string, string> = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
};

interface CellProps {
  value: CellValue;
  isWinningCell: boolean;
  isAnimating: boolean;
  staggerDelay?: number;
  settings: GameSettings;
  theme: 'light' | 'dark';
}

const Cell: React.FC<CellProps> = ({ value, isWinningCell, isAnimating, staggerDelay = 0, settings, theme }) => {
  const baseClasses = "w-full aspect-square rounded-full transform transition-shadow duration-300";
  
  const getColorClass = (player: 1 | 2) => {
    const color = player === 1 ? settings.playerColor : settings.aiColor;
    return colorClassMap[color];
  };
  
  let cellClasses = `${baseClasses} ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`;
  
  if (value === 1 || value === 2) {
    const colorClass = getColorClass(value);
    cellClasses = `${baseClasses} ${colorClass} shadow-lg`;
    
    if (isWinningCell) {
      cellClasses += " scale-90 animate-pulse ring-4 ring-yellow-300";
    }
  }

  useEffect(() => {
    if (isAnimating && value) {
      playSound('coin-drop.mp3');
    }
  }, [isAnimating, value]);

  return (
    <div className="p-0.5 sm:p-1 w-full aspect-square relative overflow-hidden">
      {isAnimating && value ? (
        <motion.div
          className={cellClasses}
          initial={{ 
            y: -300,
            opacity: 0.7,
            rotateZ: 0,
            scale: 0.8
          }}
          animate={{ 
            y: 0,
            opacity: 1,
            rotateZ: [0, 180, 360],
            scale: 1
          }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20,
            mass: 1,
            bounce: 0.3,
            duration: 0.8,
            delay: staggerDelay
          }}
        />
      ) : (
        <div className={cellClasses} />
      )}
    </div>
  );
};

export default Cell;