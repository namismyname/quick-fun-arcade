
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const ColorMatch = () => {
  const [targetColor, setTargetColor] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameRunning, setGameRunning] = useState(false);

  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'];

  const generateRound = () => {
    const target = colors[Math.floor(Math.random() * colors.length)];
    const shuffled = [...colors].sort(() => Math.random() - 0.5).slice(0, 4);
    if (!shuffled.includes(target)) {
      shuffled[0] = target;
    }
    setTargetColor(target);
    setOptions(shuffled.sort(() => Math.random() - 0.5));
  };

  const selectColor = (color: string) => {
    if (color === targetColor) {
      setScore(prev => prev + 1);
      generateRound();
    }
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameRunning(true);
    generateRound();
  };

  useEffect(() => {
    if (!gameRunning) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameRunning]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-500 to-violet-600 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Color Match</h1>
        
        <div className="mb-4 grid grid-cols-2 gap-4 text-xl">
          <div>Score: {score}</div>
          <div>Time: {timeLeft}s</div>
        </div>

        {gameRunning && (
          <div className="mb-6">
            <div className="text-2xl mb-4">Click the {targetColor} color!</div>
            <div className="grid grid-cols-2 gap-4">
              {options.map((color, index) => (
                <div
                  key={index}
                  className={`w-24 h-24 rounded-lg cursor-pointer border-4 border-white hover:scale-110 transition-transform`}
                  style={{backgroundColor: color}}
                  onClick={() => selectColor(color)}
                />
              ))}
            </div>
          </div>
        )}

        {!gameRunning && timeLeft === 0 && (
          <div className="mb-6 text-2xl">
            Game Over! Final Score: {score}
          </div>
        )}

        <Button onClick={startGame} className="w-full">
          {gameRunning ? 'Restart' : 'Start Game'}
        </Button>
      </div>
    </div>
  );
};

export default ColorMatch;
