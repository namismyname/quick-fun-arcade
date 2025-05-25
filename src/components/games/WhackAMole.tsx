
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const WhackAMole = () => {
  const [moles, setMoles] = useState(Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const startGame = () => {
    setMoles(Array(9).fill(false));
    setScore(0);
    setTimeLeft(30);
    setGameRunning(true);
    setGameOver(false);
  };

  const whackMole = (index: number) => {
    if (!gameRunning || !moles[index]) return;
    
    setScore(prev => prev + 1);
    setMoles(prev => prev.map((mole, i) => i === index ? false : mole));
  };

  useEffect(() => {
    if (!gameRunning) return;

    const gameTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameRunning(false);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const moleTimer = setInterval(() => {
      setMoles(prev => {
        const newMoles = [...prev];
        // Hide all current moles
        newMoles.fill(false);
        // Show 1-3 random moles
        const numMoles = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numMoles; i++) {
          const randomIndex = Math.floor(Math.random() * 9);
          newMoles[randomIndex] = true;
        }
        return newMoles;
      });
    }, 800);

    return () => {
      clearInterval(gameTimer);
      clearInterval(moleTimer);
    };
  }, [gameRunning]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-500 to-brown-600 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Whack-a-Mole</h1>
        
        <div className="mb-4 grid grid-cols-2 gap-4 text-xl">
          <div>Score: {score}</div>
          <div>Time: {timeLeft}s</div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6 max-w-md">
          {moles.map((mole, index) => (
            <div
              key={index}
              className={`
                w-20 h-20 rounded-full border-4 border-brown-800 cursor-pointer
                ${mole ? 'bg-brown-500' : 'bg-green-600'}
                hover:scale-110 transition-all duration-200
                flex items-center justify-center text-3xl
              `}
              onClick={() => whackMole(index)}
            >
              {mole ? '🐹' : '🕳️'}
            </div>
          ))}
        </div>

        {gameOver && (
          <div className="mb-4 text-2xl font-bold">
            Game Over! Final Score: {score}
          </div>
        )}

        <div className="mb-4 text-sm">
          Click on the moles when they appear!
        </div>

        <Button onClick={startGame} className="w-full">
          {gameRunning ? 'Restart' : 'Start Game'}
        </Button>
      </div>
    </div>
  );
};

export default WhackAMole;
