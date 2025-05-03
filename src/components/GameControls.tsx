import React from 'react';
import { RefreshCw, Home } from 'lucide-react';

interface GameControlsProps {
  onResetGame: () => void;
  onBackToMenu: () => void;
  gameOver: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ onResetGame, onBackToMenu, gameOver }) => {
  return (
    <div className="flex justify-center gap-4 mt-6">
      <button
        onClick={onBackToMenu}
        className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 bg-slate-200 text-slate-700 hover:bg-slate-300"
      >
        <Home size={20} />
        Menu
      </button>
      
      <button
        onClick={onResetGame}
        className={`
          flex items-center gap-2 px-6 py-3 rounded-full
          font-semibold transition-all duration-300
          ${gameOver
            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }
        `}
      >
        <RefreshCw size={20} />
        {gameOver ? 'New Game' : 'Reset Game'}
      </button>
    </div>
  );
};

export default GameControls