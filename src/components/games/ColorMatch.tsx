
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface ColorPattern {
  colors: string[];
  displayTime: number;
}

const ColorMatch = () => {
  const [pattern, setPattern] = useState<string[]>([]);
  const [playerPattern, setPlayerPattern] = useState<string[]>([]);
  const [displayPattern, setDisplayPattern] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<'start' | 'showing' | 'playing' | 'correct' | 'wrong'>('start');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [showingIndex, setShowingIndex] = useState(0);

  const colors = [
    { name: 'red', bg: 'bg-red-500', active: 'bg-red-300' },
    { name: 'blue', bg: 'bg-blue-500', active: 'bg-blue-300' },
    { name: 'green', bg: 'bg-green-500', active: 'bg-green-300' },
    { name: 'yellow', bg: 'bg-yellow-500', active: 'bg-yellow-300' },
    { name: 'purple', bg: 'bg-purple-500', active: 'bg-purple-300' },
    { name: 'orange', bg: 'bg-orange-500', active: 'bg-orange-300' }
  ];

  const startGame = () => {
    setLevel(1);
    setScore(0);
    generatePattern(1);
  };

  const generatePattern = (patternLength: number) => {
    const newPattern: string[] = [];
    for (let i = 0; i < patternLength; i++) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      newPattern.push(randomColor.name);
    }
    setPattern(newPattern);
    setPlayerPattern([]);
    setDisplayPattern([]);
    setGameStatus('showing');
    setShowingIndex(0);
    showPattern(newPattern);
  };

  const showPattern = (patternToShow: string[]) => {
    let index = 0;
    const showNext = () => {
      if (index < patternToShow.length) {
        setDisplayPattern([patternToShow[index]]);
        setShowingIndex(index);
        
        setTimeout(() => {
          setDisplayPattern([]);
          setTimeout(() => {
            index++;
            if (index < patternToShow.length) {
              showNext();
            } else {
              setGameStatus('playing');
            }
          }, 200);
        }, 600);
      }
    };
    showNext();
  };

  const handleColorClick = (colorName: string) => {
    if (gameStatus !== 'playing') return;

    const newPlayerPattern = [...playerPattern, colorName];
    setPlayerPattern(newPlayerPattern);

    // Check if current color is correct
    if (newPlayerPattern[newPlayerPattern.length - 1] !== pattern[newPlayerPattern.length - 1]) {
      setGameStatus('wrong');
      setTimeout(() => {
        setGameStatus('start');
      }, 2000);
      return;
    }

    // Check if pattern is complete
    if (newPlayerPattern.length === pattern.length) {
      setGameStatus('correct');
      setScore(prev => prev + level * 10);
      
      setTimeout(() => {
        const nextLevel = level + 1;
        setLevel(nextLevel);
        generatePattern(Math.min(nextLevel + 2, 8)); // Max 8 colors in pattern
      }, 1500);
    }
  };

  const getColorClass = (colorName: string) => {
    const color = colors.find(c => c.name === colorName);
    if (!color) return 'bg-gray-500';

    if (gameStatus === 'showing' && displayPattern.includes(colorName)) {
      return color.active;
    }
    return color.bg;
  };

  const resetGame = () => {
    setGameStatus('start');
    setPattern([]);
    setPlayerPattern([]);
    setDisplayPattern([]);
    setLevel(1);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center max-w-lg w-full">
        <h1 className="text-4xl font-bold mb-6">🎨 Color Match</h1>
        
        {gameStatus !== 'start' && (
          <div className="mb-6 grid grid-cols-2 gap-4 text-lg">
            <div className="bg-blue-600 rounded-lg p-3">
              <div className="text-sm">Level</div>
              <div className="text-2xl font-bold">{level}</div>
            </div>
            <div className="bg-green-600 rounded-lg p-3">
              <div className="text-sm">Score</div>
              <div className="text-2xl font-bold">{score}</div>
            </div>
          </div>
        )}

        {gameStatus === 'start' && (
          <div className="space-y-6">
            <div className="text-lg mb-6">
              Watch the pattern, then repeat it!
            </div>
            <Button onClick={startGame} className="w-full text-xl py-4">
              Start Game 🎯
            </Button>
          </div>
        )}

        {gameStatus === 'showing' && (
          <div className="mb-6">
            <div className="text-xl mb-4">Watch the pattern!</div>
            <div className="text-lg">
              Step {showingIndex + 1} of {pattern.length}
            </div>
          </div>
        )}

        {gameStatus === 'playing' && (
          <div className="mb-6">
            <div className="text-xl mb-4">Repeat the pattern!</div>
            <div className="text-lg">
              Progress: {playerPattern.length} / {pattern.length}
            </div>
          </div>
        )}

        {gameStatus === 'correct' && (
          <div className="mb-6">
            <div className="text-2xl text-green-400 mb-2">🎉 Correct!</div>
            <div>Level {level} complete! Get ready for level {level + 1}...</div>
          </div>
        )}

        {gameStatus === 'wrong' && (
          <div className="mb-6">
            <div className="text-2xl text-red-400 mb-2">❌ Wrong!</div>
            <div>The correct pattern was: {pattern.join(' → ')}</div>
            <div className="mt-2">Final Score: {score}</div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-6">
          {colors.map((color) => (
            <button
              key={color.name}
              className={`
                w-20 h-20 rounded-lg border-4 border-white/40 transition-all duration-200 hover:scale-105
                ${getColorClass(color.name)}
                ${gameStatus === 'playing' ? 'cursor-pointer' : 'cursor-default'}
              `}
              onClick={() => handleColorClick(color.name)}
              disabled={gameStatus !== 'playing'}
            >
              <span className="text-white font-bold capitalize text-sm">
                {color.name}
              </span>
            </button>
          ))}
        </div>

        {playerPattern.length > 0 && gameStatus === 'playing' && (
          <div className="mb-4">
            <div className="text-sm mb-2">Your pattern:</div>
            <div className="flex justify-center gap-2">
              {playerPattern.map((color, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 rounded ${colors.find(c => c.name === color)?.bg} border border-white/40`}
                ></div>
              ))}
            </div>
          </div>
        )}

        {gameStatus === 'wrong' && (
          <Button onClick={resetGame} className="w-full mt-4">
            Play Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default ColorMatch;
