
import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";

interface Player {
  x: number;
}

interface Invader {
  x: number;
  y: number;
}

interface Bullet {
  x: number;
  y: number;
  isPlayerBullet: boolean;
}

const SpaceInvaders = () => {
  const [player, setPlayer] = useState<Player>({x: 200});
  const [invaders, setInvaders] = useState<Invader[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [score, setScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [keys, setKeys] = useState<Set<string>>(new Set());

  const gameWidth = 400;
  const gameHeight = 500;

  const startGame = () => {
    // Create invader grid
    const newInvaders: Invader[] = [];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 8; col++) {
        newInvaders.push({
          x: 50 + col * 40,
          y: 50 + row * 40
        });
      }
    }

    setPlayer({x: 200});
    setInvaders(newInvaders);
    setBullets([]);
    setScore(0);
    setGameRunning(true);
    setGameOver(false);
  };

  const shoot = useCallback(() => {
    if (!gameRunning || gameOver) return;
    
    setBullets(prev => [...prev, {
      x: player.x,
      y: gameHeight - 60,
      isPlayerBullet: true
    }]);
  }, [player, gameRunning, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => new Set(prev).add(e.code));
      if (e.code === 'Space') {
        e.preventDefault();
        shoot();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(e.code);
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [shoot]);

  useEffect(() => {
    if (!gameRunning || gameOver) return;

    const gameLoop = setInterval(() => {
      // Update player
      setPlayer(prev => {
        let newX = prev.x;
        if (keys.has('ArrowLeft')) newX -= 5;
        if (keys.has('ArrowRight')) newX += 5;
        newX = Math.max(20, Math.min(gameWidth - 20, newX));
        return {x: newX};
      });

      // Update bullets
      setBullets(prev => {
        const newBullets = prev.map(bullet => ({
          ...bullet,
          y: bullet.isPlayerBullet ? bullet.y - 8 : bullet.y + 4
        })).filter(bullet => bullet.y > 0 && bullet.y < gameHeight);

        return newBullets;
      });

      // Check collisions
      setBullets(prev => {
        const remainingBullets = [...prev];
        setInvaders(currentInvaders => {
          const remainingInvaders = [...currentInvaders];
          
          remainingBullets.forEach((bullet, bulletIndex) => {
            if (bullet.isPlayerBullet) {
              remainingInvaders.forEach((invader, invaderIndex) => {
                const distance = Math.sqrt(
                  Math.pow(bullet.x - invader.x, 2) + Math.pow(bullet.y - invader.y, 2)
                );
                if (distance < 20) {
                  remainingInvaders.splice(invaderIndex, 1);
                  remainingBullets.splice(bulletIndex, 1);
                  setScore(s => s + 10);
                }
              });
            }
          });

          // Check if all invaders destroyed
          if (remainingInvaders.length === 0) {
            setGameOver(true);
            setGameRunning(false);
          }

          return remainingInvaders;
        });

        return remainingBullets;
      });

      // Move invaders down occasionally
      if (Math.random() < 0.01) {
        setInvaders(prev => prev.map(invader => ({
          ...invader,
          y: invader.y + 10
        })));
      }

      // Check if invaders reached player
      setInvaders(prev => {
        const hasReachedBottom = prev.some(invader => invader.y > gameHeight - 100);
        if (hasReachedBottom) {
          setGameOver(true);
          setGameRunning(false);
        }
        return prev;
      });

    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameRunning, gameOver, keys]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black to-green-900 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Space Invaders</h1>
        
        <div className="mb-4 text-xl">Score: {score}</div>

        <div 
          className="relative bg-black border-4 border-white/40 rounded-lg overflow-hidden"
          style={{width: gameWidth, height: gameHeight}}
        >
          {/* Player */}
          {gameRunning && !gameOver && (
            <div
              className="absolute w-8 h-6 bg-green-400"
              style={{
                left: player.x - 16,
                bottom: 20,
                clipPath: 'polygon(20% 100%, 0% 60%, 40% 0%, 60% 0%, 100% 60%, 80% 100%)'
              }}
            ></div>
          )}

          {/* Invaders */}
          {invaders.map((invader, index) => (
            <div
              key={index}
              className="absolute w-6 h-6 bg-red-500"
              style={{
                left: invader.x - 12,
                top: invader.y - 12,
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
              }}
            ></div>
          ))}

          {/* Bullets */}
          {bullets.map((bullet, index) => (
            <div
              key={index}
              className={`absolute w-1 h-3 ${bullet.isPlayerBullet ? 'bg-yellow-400' : 'bg-red-400'}`}
              style={{
                left: bullet.x,
                top: bullet.y
              }}
            ></div>
          ))}

          {gameOver && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold mb-4">
                  {invaders.length === 0 ? '🎉 Victory!' : '💥 Game Over!'}
                </div>
                <div className="text-xl">Final Score: {score}</div>
              </div>
            </div>
          )}

          {!gameRunning && !gameOver && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">👾 Space Invaders!</div>
                <div className="text-sm mb-4">Arrow keys to move, Space to shoot</div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-300">
          Use arrow keys to move and space to shoot
        </div>

        <Button onClick={startGame} className="w-full mt-4">
          {gameRunning ? 'Restart' : 'Start Game'}
        </Button>
      </div>
    </div>
  );
};

export default SpaceInvaders;
