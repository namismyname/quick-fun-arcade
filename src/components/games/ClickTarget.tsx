
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface Target {
  x: number;
  y: number;
  size: number;
  timeLeft: number;
  points: number;
}

const ClickTarget = () => {
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  const gameWidth = 500;
  const gameHeight = 400;

  const startGame = () => {
    setTargets([]);
    setScore(0);
    setTimeLeft(30);
    setGameRunning(true);
    setGameOver(false);
    setClicks(0);
    setAccuracy(0);
  };

  const createTarget = () => {
    const size = 30 + Math.random() * 40;
    const points = Math.round(100 / size * 10); // Smaller targets worth more points
    
    const target: Target = {
      x: Math.random() * (gameWidth - size),
      y: Math.random() * (gameHeight - size),
      size,
      timeLeft: 2000 + Math.random() * 1000, // 2-3 seconds
      points
    };
    
    setTargets(prev => [...prev, target]);
  };

  const hitTarget = (targetIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = targets[targetIndex];
    setScore(prev => prev + target.points);
    setTargets(prev => prev.filter((_, index) => index !== targetIndex));
    setClicks(prev => {
      const newClicks = prev + 1;
      const newHits = Math.floor(score / 10) + 1; // Rough estimate of hits
      setAccuracy(Math.round((newHits / newClicks) * 100));
      return newClicks;
    });
  };

  const missTarget = () => {
    setClicks(prev => {
      const newClicks = prev + 1;
      const newHits = Math.floor(score / 10); // Rough estimate of hits
      setAccuracy(Math.round((newHits / newClicks) * 100));
      return newClicks;
    });
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

    const targetSpawner = setInterval(() => {
      if (Math.random() < 0.7) { // 70% chance to spawn target
        createTarget();
      }
    }, 800);

    const targetUpdater = setInterval(() => {
      setTargets(prev => prev.map(target => ({
        ...target,
        timeLeft: target.timeLeft - 50
      })).filter(target => target.timeLeft > 0));
    }, 50);

    return () => {
      clearInterval(gameTimer);
      clearInterval(targetSpawner);
      clearInterval(targetUpdater);
    };
  }, [gameRunning, gameOver]);

  const getTargetColor = (target: Target) => {
    const timeRatio = target.timeLeft / 3000;
    if (timeRatio > 0.6) return 'bg-green-500';
    if (timeRatio > 0.3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-500 to-orange-600 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Click the Target</h1>
        
        <div className="mb-4 grid grid-cols-3 gap-4 text-lg">
          <div>Score: {score}</div>
          <div>Time: {timeLeft}s</div>
          <div>Accuracy: {accuracy}%</div>
        </div>

        <div 
          className="relative bg-blue-100 border-4 border-white/40 rounded-lg overflow-hidden cursor-crosshair"
          style={{width: gameWidth, height: gameHeight}}
          onClick={missTarget}
        >
          {/* Targets */}
          {targets.map((target, index) => (
            <div
              key={index}
              className={`absolute rounded-full border-4 border-white cursor-pointer flex items-center justify-center font-bold text-white transition-all duration-100 hover:scale-110 ${getTargetColor(target)}`}
              style={{
                left: target.x,
                top: target.y,
                width: target.size,
                height: target.size,
                fontSize: Math.max(10, target.size / 4)
              }}
              onClick={(e) => hitTarget(index, e)}
            >
              {target.points}
            </div>
          ))}

          {/* Crosshair in center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-8 h-0.5 bg-black/30"></div>
            <div className="w-0.5 h-8 bg-black/30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>

          {gameOver && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold mb-4">Time's Up!</div>
                <div className="text-xl mb-2">Final Score: {score}</div>
                <div className="text-lg mb-2">Accuracy: {accuracy}%</div>
                <div className="text-sm">Clicks: {clicks}</div>
              </div>
            </div>
          )}

          {!gameRunning && !gameOver && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">🎯 Click the Target!</div>
                <div className="text-sm mb-4">
                  Click the colored circles as fast as you can!<br/>
                  Smaller targets = more points<br/>
                  Red targets disappear faster
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-300">
          Click the targets before they disappear! Smaller targets are worth more points.
        </div>

        <Button onClick={startGame} className="w-full mt-4">
          {gameRunning ? 'Restart' : 'Start Game'}
        </Button>
      </div>
    </div>
  );
};

export default ClickTarget;
