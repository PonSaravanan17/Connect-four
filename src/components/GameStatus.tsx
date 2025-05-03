import React, { useEffect } from 'react';
import { GameState } from '../types/gameTypes';
import { ArrowRight, Award, Timer } from 'lucide-react';
import { playSound } from '../utils/soundUtils';

interface GameStatusProps {
  gameState: GameState;
  theme: 'light' | 'dark';
}

const playerTextColors: Record<string, { light: string; dark: string }> = {
  red:   { light: '#dc2626', dark: '#fca5a5' },
  blue:  { light: '#2563eb', dark: '#93c5fd' },
  green: { light: '#22c55e', dark: '#6ee7b7' },
  yellow:{ light: '#eab308', dark: '#fde68a' },
};

const getTextColor = (color: string, theme: 'light' | 'dark') =>
  playerTextColors[color]?.[theme] || (theme === 'dark' ? '#f3f4f6' : '#1e293b');

const GameStatus: React.FC<GameStatusProps> = ({ gameState, theme }) => {
  const { currentPlayer, gameOver, winner, isDraw, playerScore, aiScore, isThinking, settings } = gameState;
  
  useEffect(() => {
    if (gameOver) {
      if (isDraw) playSound('draw.mp3');
      else if (winner === 1) playSound('win.mp3');
      else if (winner === 2) playSound('lose.mp3');
    }
  }, [gameOver, isDraw, winner]);

  const getColorClass = (player: 1 | 2) => {
    const color = player === 1 ? settings.playerColor : settings.aiColor;
    return `bg-${color}-500`;
  };
  
  return (
    <div className="text-center mb-6">
      <div className="flex justify-center gap-8 items-center mb-4">
        <div className={`flex items-center gap-2 text-lg font-semibold p-3 rounded-lg ${currentPlayer === 1 && !gameOver ? `bg-${settings.playerColor}-100 ring-2 ring-${settings.playerColor}-500` : ''}`}>
          <div className={`w-4 h-4 rounded-full ${getColorClass(1)}`}></div>
          <span style={{ color: getTextColor(settings.playerColor, theme) }}>You: {playerScore}</span>
        </div>
        <div className={`flex items-center gap-2 text-lg font-semibold p-3 rounded-lg ${currentPlayer === 2 && !gameOver ? `bg-${settings.aiColor}-100 ring-2 ring-${settings.aiColor}-500` : ''}`}>
          <div className={`w-4 h-4 rounded-full ${getColorClass(2)}`}></div>
          <span style={{ color: getTextColor(settings.aiColor, theme) }}>AI: {aiScore}</span>
        </div>
      </div>
      
      <div className="h-12 flex items-center justify-center">
        {gameOver ? (
          isDraw ? (
            <p className="text-xl font-bold text-slate-700 dark:text-slate-200">Game ended in a draw!</p>
          ) : (
            <p className="text-xl font-bold flex items-center justify-center gap-2">
              <Award className="text-yellow-500" size={24} />
              <span style={{ color: getTextColor(winner === 1 ? settings.playerColor : settings.aiColor, theme) }} className="font-bold">
                {winner === 1 ? 'You win!' : 'AI wins!'}
              </span>
              <Award className="text-yellow-500" size={24} />
            </p>
          )
        ) : (
          <p className="text-lg font-medium flex items-center justify-center">
            {currentPlayer === 1 ? (
              <>
                <span style={{ color: getTextColor(settings.playerColor, theme), fontWeight: 600 }}>Your turn</span>
                <ArrowRight className="mx-2 text-slate-500 dark:text-slate-300" size={20} />
                <span className="text-slate-500 dark:text-slate-300">Select a column</span>
              </>
            ) : (
              <span style={{ color: getTextColor(settings.aiColor, theme), fontWeight: 600 }} className="flex items-center gap-2">
                AI is thinking
                {isThinking && (
                  <span className="inline-flex">
                    <Timer className="animate-pulse text-slate-500 dark:text-slate-300" size={20} />
                  </span>
                )}
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default GameStatus;