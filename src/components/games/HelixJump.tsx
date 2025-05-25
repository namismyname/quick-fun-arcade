
import { useState } from 'react';
import { Button } from "@/components/ui/button";

const HelixJump = () => {
  const [ballY, setBallY] = useState(50);
  const [score, setScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);

  const startGame = () => {
    setGameRunning(true);
    setScore(0);
    setBallY(50);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Helix Jump</h1>
        
        <div className="mb-4 text-xl">Score: {score}</div>

        <div className="w-64 h-96 bg-gradient-to-b from-purple-400 to-pink-400 border-4 border-white/40 rounded-lg mb-6 relative overflow-hidden">
          <div 
            className="absolute w-8 h-8 bg-yellow-400 rounded-full border-2 border-white transition-all"
            style={{left: '50%', top: `${ballY}%`, transform: 'translateX(-50%)'}}
          >
          </div>
          
          {/* Helix platforms */}
          <div className="absolute w-full h-4 bg-red-500" style={{top: '20%'}}></div>
          <div className="absolute w-full h-4 bg-red-500" style={{top: '40%'}}></div>
          <div className="absolute w-full h-4 bg-red-500" style={{top: '60%'}}></div>
          <div className="absolute w-full h-4 bg-red-500" style={{top: '80%'}}></div>

          {!gameRunning && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl font-bold">🌀 Coming Soon! 🏀</div>
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

export default HelixJump;
