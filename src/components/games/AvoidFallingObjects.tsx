
import { useState } from 'react';
import { Button } from "@/components/ui/button";

const AvoidFallingObjects = () => {
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);

  const startGame = () => {
    setGameRunning(true);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-500 to-orange-600 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Avoid Falling Objects</h1>
        
        <div className="mb-4 text-xl">Score: {score}</div>

        <div className="w-96 h-96 bg-sky-300 border-4 border-white/40 rounded-lg mb-6 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl">🏃‍♂️ Coming Soon! ⚠️</div>
          </div>
        </div>

        <Button onClick={startGame} className="w-full">
          Start Game
        </Button>
      </div>
    </div>
  );
};

export default AvoidFallingObjects;
