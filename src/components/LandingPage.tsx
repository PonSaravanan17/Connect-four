import React, { useContext } from 'react';
import { motion, Variants } from 'framer-motion';
import { GameSettings } from '../types/gameTypes';
import { Trophy, Gamepad2, Brain, Sparkles, Sun, Moon } from 'lucide-react';
import { ThemeContext } from '../theme/ThemeContext';

interface LandingPageProps {
  onStartGame: (settings: GameSettings) => void;
}

const ColorOption: React.FC<{
  color: string,
  selected: boolean,
  disabled: boolean,
  onClick: () => void
}> = ({ color, selected, disabled, onClick }) => (
  <motion.button
    whileHover={{ scale: disabled ? 1 : 1.2, rotate: disabled ? 0 : 10 }}
    whileTap={{ scale: disabled ? 1 : 0.95, rotate: 0 }}
    className={`
      w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-300
      ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:shadow-xl'}
      ${selected ? 'ring-4 ring-white ring-opacity-80 scale-110' : ''}
      ${color === 'red' ? 'bg-red-500' : 
        color === 'blue' ? 'bg-blue-500' : 
        color === 'green' ? 'bg-green-500' : 
        'bg-yellow-500'}
    `}
    onClick={!disabled ? onClick : undefined}
    aria-label={`Select ${color}`}
  />
);

const DifficultyButton: React.FC<{
  level: string,
  selected: boolean,
  icon: React.ReactNode,
  onClick: () => void
}> = ({ level, selected, icon, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.08, backgroundColor: '#7c3aed' }}
    whileTap={{ scale: 0.97 }}
    className={`
      px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold text-white
      flex items-center gap-2 transition-all duration-300
      ${selected ? 'bg-indigo-700 shadow-2xl scale-110 ring-2 ring-yellow-300' : 'bg-indigo-500 hover:bg-indigo-600'}
    `}
    onClick={onClick}
    aria-pressed={selected}
  >
    {icon}
    {level}
  </motion.button>
);

const bubbleVariants: Variants = {
  animate: {
    y: [0, -100, 0],
    opacity: [0.2, 0.5, 0.2],
    transition: {
      duration: 8,
      repeat: Infinity,
      repeatType: 'loop' as const,
      ease: 'easeInOut',
    }
  }
};

// Animated Connect 4 board preview
const colorClassMap: Record<string, string> = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
};
const PreviewBoard: React.FC<{ playerColor: string; aiColor: string }> = ({ playerColor, aiColor }) => {
  // 6 rows x 7 columns
  const rows = 6;
  const cols = 7;
  // Example pattern: alternate player and ai coins in a diagonal
  const getCell = (row: number, col: number) => {
    if ((row + col) % 3 === 0) return playerColor;
    if ((row + col) % 3 === 1) return aiColor;
    return null;
  };
  return (
    <div className="w-full flex justify-center mb-4 sm:mb-6">
      <div className="bg-blue-700 dark:bg-blue-900 p-1 sm:p-2 rounded-2xl shadow-lg transition-colors duration-500">
        <div className="flex bg-blue-800 dark:bg-blue-950 rounded-xl overflow-hidden transition-colors duration-500 gap-0.5 sm:gap-1" style={{ gap: 2 }}>
          {Array.from({ length: cols }).map((_, colIdx) => (
            <div key={colIdx} className="flex flex-col-reverse gap-0.5 sm:gap-1">
              {Array.from({ length: rows }).map((_, rowIdx) => {
                const color = getCell(rowIdx, colIdx);
                return (
                  <motion.div
                    key={rowIdx}
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${color ? colorClassMap[color] : 'bg-slate-200 dark:bg-slate-700'} shadow-md transition-colors duration-500`}
                    initial={{ y: -60, scale: 0.7, opacity: 0.7 }}
                    animate={{ y: 0, scale: 1, opacity: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 15,
                      mass: 1,
                      delay: 0.05 * (rowIdx + colIdx),
                      bounce: 0.5
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onStartGame }) => {
  const [selectedColor, setSelectedColor] = React.useState<string>('red');
  const [difficulty, setDifficulty] = React.useState<'easy' | 'medium' | 'hard'>('medium');
  const { theme, toggleTheme } = useContext(ThemeContext);

  const colors = ['red', 'blue', 'green', 'yellow'];
  const aiColors = colors.filter(c => c !== selectedColor);
  const aiColor = aiColors[0]; // Always show the first available AI color for preview

  // Animated background bubbles (framer-motion version)
  const bubbles = Array.from({ length: 18 }).map((_, i) => (
    <motion.div
      key={i}
      className={`absolute rounded-full pointer-events-none transition-colors duration-500 ${theme === 'dark' ? 'bg-white/20' : 'bg-blue-300/30'}`}
      style={{
        width: `${16 + (i % 6) * 8}px`,
        height: `${16 + (i % 6) * 8}px`,
        left: `${(i * 11) % 100}%`,
        bottom: `${(i * 17) % 100}%`,
        zIndex: 1
      }}
      variants={bubbleVariants}
      animate="animate"
      initial={false}
    />
  ));

  const handleStartGame = () => {
    const aiColors = colors.filter(c => c !== selectedColor);
    const aiColor = aiColors[Math.floor(Math.random() * aiColors.length)];
    onStartGame({
      playerColor: selectedColor as GameSettings['playerColor'],
      aiColor: aiColor as GameSettings['aiColor'],
      difficulty
    });
  };

  return (
    <div className={`relative min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-gradient-to-b from-slate-950 to-slate-900' : 'bg-gradient-to-b from-slate-100 to-slate-200'}`}>
      {bubbles}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 w-full">
        <div className="absolute right-0 top-0 mr-2 sm:mr-4 mt-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 shadow hover:scale-110 transition-transform duration-200"
            aria-label="Toggle dark/light mode"
          >
            {theme === 'dark' ? <Sun className="text-yellow-400" /> : <Moon className="text-slate-700" />}
          </button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring', bounce: 0.3 }}
          className="text-center mb-4 sm:mb-8"
        >
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: 'spring', bounce: 0.4 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-slate-800 dark:text-slate-100 mb-2 sm:mb-4 flex items-center justify-center gap-2 drop-shadow-lg"
          >
            <Trophy className="text-yellow-400 animate-bounce" />
            Connect 4
            <Trophy className="text-yellow-400 animate-bounce" />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-base sm:text-xl text-slate-600 dark:text-slate-300"
          >
            Challenge our AI in this classic game!
          </motion.p>
        </motion.div>

        {/* Animated Connect 4 board preview */}
        <PreviewBoard playerColor={selectedColor} aiColor={aiColor} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, type: 'spring', bounce: 0.2 }}
          className="rounded-2xl p-4 sm:p-8 w-full max-w-xs sm:max-w-md shadow-2xl bg-white dark:bg-slate-900 transition-colors duration-500"
        >
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2 sm:mb-4 flex items-center gap-2">
              <Gamepad2 className="text-purple-400 animate-spin-slow" />
              Choose Your Color
            </h2>
            <div className="flex justify-center gap-2 sm:gap-4">
              {colors.map(color => (
                <ColorOption
                  key={color}
                  color={color}
                  selected={selectedColor === color}
                  disabled={false}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2 sm:mb-4 flex items-center gap-2">
              <Brain className="text-purple-400 animate-pulse" />
              Select Difficulty
            </h2>
            <div className="flex flex-col gap-2 sm:gap-3">
              <DifficultyButton
                level="Easy"
                selected={difficulty === 'easy'}
                icon={<Sparkles size={18} />}
                onClick={() => setDifficulty('easy')}
              />
              <DifficultyButton
                level="Medium"
                selected={difficulty === 'medium'}
                icon={<Sparkles size={18} />}
                onClick={() => setDifficulty('medium')}
              />
              <DifficultyButton
                level="Hard"
                selected={difficulty === 'hard'}
                icon={<Sparkles size={18} />}
                onClick={() => setDifficulty('hard')}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring', bounce: 0.5, duration: 0.7 }}
            className="w-full py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold text-base sm:text-lg shadow-lg hover:shadow-2xl transition-all duration-300 mt-2"
            onClick={handleStartGame}
          >
            Start Game
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;