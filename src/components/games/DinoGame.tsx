
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const DinoGame = () => {
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [dinoY, setDinoY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);

  const jump = () => {
    if (!isJumping) {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 600);
    }
  };

  const startGame = () => {
    setGameRunning(true);
    setScore(0);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-yellow-300 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Dino Game</h1>
        
        <div className="mb-4 text-xl">Score: {score}</div>

        <div className="w-96 h-48 bg-gradient-to-b from-blue-200 to-yellow-200 border-4 border-white/40 rounded-lg mb-6 relative overflow-hidden">
          <div className="absolute bottom-4 w-full h-8 bg-green-400"></div>
          <div 
            className={`absolute bottom-12 left-8 w-8 h-8 text-2xl transition-all duration-300 ${isJumping ? 'bottom-24' : 'bottom-12'}`}
          >
            🦕
          </div>
          {!gameRunning && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl font-bold">Press Space to Jump!</div>
              </div>
            </div>
          )}
        </div>

        <Button onClick={startGame} className="w-full">
          {gameRunning ? 'Restart' : 'Start Game'}
        </Button>
      </div>
    </div>
  );
};

export default DinoGame;
