
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface Balloon {
  id: number;
  x: number;
  y: number;
  color: string;
  speed: number;
  points: number;
}

const BalloonPop = () => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [nextId, setNextId] = useState(1);

  const gameWidth = 600;
  const gameHeight = 400;
  
  const balloonColors = [
    { color: 'bg-red-500', points: 10 },
    { color: 'bg-blue-500', points: 15 },
    { color: 'bg-green-500', points: 20 },
    { color: 'bg-yellow-500', points: 5 },
    { color: 'bg-purple-500', points: 25 },
    { color: 'bg-pink-500', points: 30 }
  ];

  const startGame = () => {
    setBalloons([]);
    setScore(0);
    setTimeLeft(60);
    setGameRunning(true);
    setGameOver(false);
    setNextId(1);
  };

  const createBalloon = () => {
    const colorData = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    const balloon: Balloon = {
      id: nextId,
      x: Math.random() * (gameWidth - 60) + 30,
      y: gameHeight + 30,
      color: colorData.color,
      speed: 1 + Math.random() * 2,
      points: colorData.points
    };
    
    setBalloons(prev => [...prev, balloon]);
    setNextId(prev => prev + 1);
  };

  const popBalloon = (balloonId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const balloon = balloons.find(b => b.id === balloonId);
    if (balloon) {
      setScore(prev => prev + balloon.points);
      setBalloons(prev => prev.filter(b => b.id !== balloonId));
    }
  };

  useEffect(() => {
    if (!gameRunning || gameOver) return;

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

    const balloonSpawner = setInterval(() => {
      if (Math.random() < 0.4) { // 40% chance to spawn balloon
        createBalloon();
      }
    }, 800);

    const balloonUpdater = setInterval(() => {
      setBalloons(prev => prev.map(balloon => ({
        ...balloon,
        y: balloon.y - balloon.speed
      })).filter(balloon => balloon.y > -60)); // Remove balloons that go off screen
    }, 50);

    return () => {
      clearInterval(gameTimer);
      clearInterval(balloonSpawner);
      clearInterval(balloonUpdater);
    };
  }, [gameRunning, gameOver]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">🎈 Balloon Pop</h1>
        
        <div className="mb-4 grid grid-cols-2 gap-4 text-xl">
          <div>Score: {score}</div>
          <div>Time: {timeLeft}s</div>
        </div>

        <div 
          className="relative bg-gradient-to-b from-sky-200 to-green-300 border-4 border-white/40 rounded-lg overflow-hidden"
          style={{width: gameWidth, height: gameHeight}}
        >
          {/* Clouds */}
          <div className="absolute top-10 left-20 w-16 h-8 bg-white/70 rounded-full"></div>
          <div className="absolute top-20 right-30 w-20 h-10 bg-white/70 rounded-full"></div>
          <div className="absolute top-5 right-20 w-12 h-6 bg-white/70 rounded-full"></div>

          {/* Sun */}
          <div className="absolute top-10 right-10 w-12 h-12 bg-yellow-400 rounded-full border-4 border-yellow-300"></div>

          {/* Balloons */}
          {balloons.map((balloon) => (
            <div
              key={balloon.id}
              className={`absolute cursor-pointer transform hover:scale-110 transition-transform`}
              style={{
                left: balloon.x - 30,
                top: balloon.y - 30,
              }}
              onClick={(e) => popBalloon(balloon.id, e)}
            >
              {/* Balloon */}
              <div className={`w-12 h-16 ${balloon.color} rounded-full border-2 border-white shadow-lg relative`}>
                {/* Highlight */}
                <div className="absolute top-2 left-2 w-3 h-3 bg-white/50 rounded-full"></div>
                {/* String */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gray-800"></div>
              </div>
              {/* Points indicator */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xs">
                {balloon.points}
              </div>
            </div>
          ))}

          {gameOver && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold mb-4">Time's Up!</div>
                <div className="text-xl mb-2">Final Score: {score}</div>
                <div className="text-sm">Great job popping balloons! 🎈</div>
              </div>
            </div>
          )}

          {!gameRunning && !gameOver && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">🎈 Pop the Balloons!</div>
                <div className="text-sm mb-4">
                  Click the balloons before they float away!<br/>
                  Different colors = different points<br/>
                  Purple and pink balloons are worth the most!
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-300">
          Click the balloons as they float up! Different colors are worth different points.
        </div>

        <Button onClick={startGame} className="w-full mt-4">
          {gameRunning ? 'Restart' : 'Start Game'}
        </Button>
      </div>
    </div>
  );
};

export default BalloonPop;
