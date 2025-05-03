import React, { useContext } from 'react';
import LandingPage from './components/LandingPage';
import { GameSettings } from './types/gameTypes';
import { Trophy, Sun, Moon } from 'lucide-react';
import GameContainer from './components/GameContainer';
import { ThemeProvider, ThemeContext } from './theme/ThemeContext';
import { playSound } from './utils/soundUtils';

function AppContent() {
  const [gameStarted, setGameStarted] = React.useState(false);
  const [settings, setSettings] = React.useState<GameSettings | null>(null);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleStartGame = (newSettings: GameSettings) => {
    setSettings(newSettings);
    setGameStarted(true);
  };

  const handleResetToMenu = () => {
    setGameStarted(false);
    setSettings(null);
  };

  const handleToggleTheme = () => {
    playSound('toggle.mp3');
    toggleTheme();
  };

  if (!gameStarted || !settings) {
    return <LandingPage onStartGame={handleStartGame} />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b flex flex-col items-center justify-center p-4 transition-colors duration-500 ${theme === 'dark' ? 'from-slate-950 to-slate-900' : 'from-slate-100 to-slate-200'}`}>
      <header className="mb-6 text-center w-full flex flex-col items-center relative">
        <div className="absolute right-0 top-0 mr-4 mt-2">
          <button
            onClick={handleToggleTheme}
            className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 shadow hover:scale-110 transition-transform duration-200"
            aria-label="Toggle dark/light mode"
          >
            {theme === 'dark' ? <Sun className="text-yellow-400" /> : <Moon className="text-slate-700" />}
          </button>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2 mb-2">
          <Trophy size={32} className="text-yellow-500" />
          Connect 4
          <Trophy size={32} className="text-yellow-500" />
        </h1>
        <p className="text-slate-600 dark:text-slate-300">Connect four pieces in a row to win!</p>
      </header>

      <GameContainer
        key={JSON.stringify(settings)}
        settings={settings}
        onBackToMenu={handleResetToMenu}
      />

      <footer className="mt-8 text-center text-slate-500 dark:text-slate-400 text-sm">
        <p>© 2025 Connect 4 Game • Play against AI</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;