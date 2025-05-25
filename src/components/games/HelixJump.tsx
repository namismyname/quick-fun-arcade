
import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";

interface Platform {
  y: number;
  rotation: number;
  hasGap: boolean;
  gapStart: number;
  gapEnd: number;
  color: string;
}

const HelixJump = () => {
  const [ballY, setBallY] = useState(100);
  const [ballVelocity, setBallVelocity] = useState(0);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [score, setScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [towerRotation, setTowerRotation] = useState(0);

  const gameHeight = 600;
  const ballSize = 20;
  const platformHeight = 20;
  const platformSpacing = 80;
  const gravity = 0.3;
  const bounceStrength = -8;

  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];

  const generatePlatforms = () => {
    const newPlatforms: Platform[] = [];
    for (let i = 0; i < 20; i++) {
      const gapSize = 80 + Math.random() * 40; // Gap size between 80-120 degrees
      const gapStart = Math.random() * (360 - gapSize);
      newPlatforms.push({
        y: i * platformSpacing + 200,
        rotation: 0,
        hasGap: true,
        gapStart: gapStart,
        gapEnd: gapStart + gapSize,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    return newPlatforms;
  };

  const startGame = () => {
    setBallY(100);
    setBallVelocity(0);
    setPlatforms(generatePlatforms());
    setScore(0);
    setGameRunning(true);
    setGameOver(false);
    setTowerRotation(0);
  };

  const rotateTower = useCallback((direction: 'left' | 'right') => {
    if (!gameRunning) return;
    const rotationSpeed = 5;
    setTowerRotation(prev => prev + (direction === 'left' ? -rotationSpeed : rotationSpeed));
  }, [gameRunning]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        rotateTower('left');
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        rotateTower('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rotateTower]);

  useEffect(() => {
    if (!gameRunning || gameOver) return;

    const gameLoop = setInterval(() => {
      setBallVelocity(prev => prev + gravity);
      setBallY(prev => {
        const newY = prev + ballVelocity;
        
        // Check platform collisions
        platforms.forEach((platform, index) => {
          const ballCenterY = newY + ballSize / 2;
          const platformTop = platform.y;
          const platformBottom = platform.y + platformHeight;
          
          if (ballCenterY >= platformTop && ballCenterY <= platformBottom && ballVelocity > 0) {
            // Check if ball is in the gap
            const ballAngle = ((towerRotation % 360) + 360) % 360;
            const gapStart = platform.gapStart;
            const gapEnd = platform.gapEnd;
            
            let inGap = false;
            if (gapEnd > 360) {
              // Gap wraps around 360
              inGap = ballAngle >= gapStart || ballAngle <= (gapEnd - 360);
            } else {
              inGap = ballAngle >= gapStart && ballAngle <= gapEnd;
            }
            
            if (inGap) {
              // Ball falls through gap
              setScore(prev => prev + 10);
            } else {
              // Ball hits platform
              if (platform.color === 'bg-red-500') {
                // Red platforms are deadly
                setGameOver(true);
                setGameRunning(false);
              } else {
                // Bounce off platform
                setBallVelocity(bounceStrength);
              }
            }
          }
        });

        // Check if ball fell off screen
        if (newY > gameHeight) {
          setGameOver(true);
          setGameRunning(false);
        }

        return newY;
      });

      // Move platforms down as score increases
      setPlatforms(prev => prev.map(platform => ({
        ...platform,
        y: platform.y - 0.5
      })));

    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameRunning, gameOver, ballVelocity, platforms, towerRotation]);

  const getBallPosition = () => {
    const radius = 80;
    const angle = (towerRotation * Math.PI) / 180;
    return {
      x: 200 + radius * Math.cos(angle),
      y: ballY
    };
  };

  const ballPosition = getBallPosition();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-800 to-indigo-900 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">🌪️ Helix Jump</h1>
        
        <div className="mb-4 text-xl">Score: {score}</div>

        <div 
          className="relative bg-black border-4 border-white/40 rounded-lg overflow-hidden"
          style={{width: 400, height: gameHeight}}
        >
          {/* Central Tower */}
          <div className="absolute left-1/2 top-0 w-4 h-full bg-gray-400 transform -translate-x-1/2"></div>

          {/* Platforms */}
          {platforms.map((platform, index) => (
            <div key={index} style={{position: 'absolute', left: '50%', top: platform.y, transform: 'translateX(-50%)'}}>
              {/* Platform segments */}
              {Array.from({length: 12}).map((_, segmentIndex) => {
                const segmentAngle = (segmentIndex * 30) + platform.rotation;
                const segmentStart = segmentAngle;
                const segmentEnd = segmentAngle + 30;
                
                let isInGap = false;
                if (platform.gapEnd > 360) {
                  isInGap = (segmentStart >= platform.gapStart || segmentEnd <= (platform.gapEnd - 360));
                } else {
                  isInGap = (segmentStart >= platform.gapStart && segmentEnd <= platform.gapEnd);
                }

                if (isInGap) return null;

                const radius = 100;
                const x = radius * Math.cos((segmentAngle * Math.PI) / 180);
                const y = radius * Math.sin((segmentAngle * Math.PI) / 180);
                
                return (
                  <div
                    key={segmentIndex}
                    className={`absolute w-8 h-5 ${platform.color} border border-white/20`}
                    style={{
                      left: x - 16,
                      top: y - 10,
                      transform: `rotate(${segmentAngle}deg)`
                    }}
                  ></div>
                );
              })}
            </div>
          ))}

          {/* Ball */}
          <div
            className="absolute bg-yellow-400 rounded-full border-2 border-yellow-600 shadow-lg"
            style={{
              left: ballPosition.x - ballSize/2,
              top: ballPosition.y - ballSize/2,
              width: ballSize,
              height: ballSize
            }}
          >
            <div className="absolute top-1 left-1 w-2 h-2 bg-white/60 rounded-full"></div>
          </div>

          {gameOver && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold mb-4">Game Over!</div>
                <div className="text-xl">Final Score: {score}</div>
                <div className="text-sm mt-2">Avoid red platforms!</div>
              </div>
            </div>
          )}

          {!gameRunning && !gameOver && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">🌪️ Helix Jump!</div>
                <div className="text-sm mb-4">
                  Arrow keys or A/D to rotate<br/>
                  Fall through gaps, avoid platforms<br/>
                  Red platforms are deadly!
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <Button 
            onMouseDown={() => rotateTower('left')}
            className="bg-blue-500 hover:bg-blue-600"
          >
            ← Rotate Left
          </Button>
          <Button 
            onMouseDown={() => rotateTower('right')}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Rotate Right →
          </Button>
        </div>

        <div className="mt-4 text-sm text-gray-300">
          Use arrow keys (or buttons) to rotate the tower. Fall through gaps to score!
        </div>

        <Button onClick={startGame} className="w-full mt-4">
          {gameRunning ? 'Restart' : 'Start Game'}
        </Button>
      </div>
    </div>
  );
};

export default HelixJump;
