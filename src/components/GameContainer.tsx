import React, { useContext } from 'react';
import GameBoard from './GameBoard';
import GameStatus from './GameStatus';
import GameControls from './GameControls';
import { useConnect4Game } from '../hooks/useConnect4Game';
import { GameSettings } from '../types/gameTypes';
import { ThemeContext } from '../theme/ThemeContext';

interface GameContainerProps {
  settings: GameSettings;
  onBackToMenu: () => void;
}

const GameContainer: React.FC<GameContainerProps> = ({ settings, onBackToMenu }) => {
  const { gameState, handlePlayerMove, resetGame } = useConnect4Game(settings);
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`w-full max-w-xl rounded-2xl shadow-xl p-6 transition-colors duration-500 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
      <GameStatus gameState={gameState} theme={theme} />
      <GameBoard 
        board={gameState.board}
        onColumnClick={handlePlayerMove}
        gameState={gameState}
        theme={theme}
      />
      <GameControls 
        onResetGame={resetGame}
        onBackToMenu={onBackToMenu}
        gameOver={gameState.gameOver}
      />
    </div>
  );
};

export default GameContainer; 