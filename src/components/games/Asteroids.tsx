
import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";

interface Ship {
  x: number;
  y: number;
  angle: number;
  velocity: {x: number, y: number};
}

interface Asteroid {
  x: number;
  y: number;
  velocity: {x: number, y: number};
  size: number;
}

interface Bullet {
  x: number;
  y: number;
  velocity: {x: number, y: number};
  life: number;
}

const Asteroids = () => {
  const [ship, setShip] = useState<Ship>({x: 200, y: 200, angle: 0, velocity: {x: 0, y: 0}});
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [score, setScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [keys, setKeys] = useState<Set<string>>(new Set());

  const gameWidth = 400;
  const gameHeight = 400;

  const startGame = () => {
    setShip({x: 200, y: 200, angle: 0, velocity: {x: 0, y: 0}});
    setAsteroids([
      {x: 100, y: 100, velocity: {x: 1, y: 1}, size: 30},
      {x: 300, y: 100, velocity: {x: -1, y: 1}, size: 30},
      {x: 100, y: 300, velocity: {x: 1, y: -1}, size: 30},
    ]);
    setBullets([]);
    setScore(0);
    setGameRunning(true);
  };

  const shoot = useCallback(() => {
    if (!gameRunning) return;
    
    const bulletSpeed = 5;
    const bullet: Bullet = {
      x: ship.x,
      y: ship.y,
      velocity: {
        x: Math.cos(ship.angle) * bulletSpeed,
        y: Math.sin(ship.angle) * bulletSpeed
      },
      life: 60
    };
    setBullets(prev => [...prev, bullet]);
  }, [ship, gameRunning]);

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
    if (!gameRunning) return;

    const gameLoop = setInterval(() => {
      // Update ship
      setShip(prev => {
        let newShip = {...prev};
        
        if (keys.has('ArrowLeft')) newShip.angle -= 0.1;
        if (keys.has('ArrowRight')) newShip.angle += 0.1;
        if (keys.has('ArrowUp')) {
          const thrust = 0.2;
          newShip.velocity.x += Math.cos(newShip.angle) * thrust;
          newShip.velocity.y += Math.sin(newShip.angle) * thrust;
        }

        // Apply friction
        newShip.velocity.x *= 0.99;
        newShip.velocity.y *= 0.99;

        // Update position
        newShip.x += newShip.velocity.x;
        newShip.y += newShip.velocity.y;

        // Wrap around screen
        if (newShip.x < 0) newShip.x = gameWidth;
        if (newShip.x > gameWidth) newShip.x = 0;
        if (newShip.y < 0) newShip.y = gameHeight;
        if (newShip.y > gameHeight) newShip.y = 0;

        return newShip;
      });

      // Update bullets
      setBullets(prev => prev.map(bullet => ({
        ...bullet,
        x: bullet.x + bullet.velocity.x,
        y: bullet.y + bullet.velocity.y,
        life: bullet.life - 1
      })).filter(bullet => bullet.life > 0));

      // Update asteroids
      setAsteroids(prev => prev.map(asteroid => ({
        ...asteroid,
        x: (asteroid.x + asteroid.velocity.x + gameWidth) % gameWidth,
        y: (asteroid.y + asteroid.velocity.y + gameHeight) % gameHeight
      })));

    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameRunning, keys]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black to-purple-900 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Asteroids</h1>
        
        <div className="mb-4 text-xl">Score: {score}</div>

        <div 
          className="relative bg-black border-4 border-white/40 rounded-lg overflow-hidden"
          style={{width: gameWidth, height: gameHeight}}
        >
          {/* Ship */}
          {gameRunning && (
            <div
              className="absolute w-4 h-4 border-2 border-white"
              style={{
                left: ship.x - 8,
                top: ship.y - 8,
                transform: `rotate(${ship.angle + Math.PI/2}rad)`,
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
              }}
            ></div>
          )}

          {/* Asteroids */}
          {asteroids.map((asteroid, index) => (
            <div
              key={index}
              className="absolute bg-gray-500 rounded-full border-2 border-gray-300"
              style={{
                left: asteroid.x - asteroid.size/2,
                top: asteroid.y - asteroid.size/2,
                width: asteroid.size,
                height: asteroid.size
              }}
            ></div>
          ))}

          {/* Bullets */}
          {bullets.map((bullet, index) => (
            <div
              key={index}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                left: bullet.x - 1,
                top: bullet.y - 1
              }}
            ></div>
          ))}

          {!gameRunning && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">🚀 Asteroids!</div>
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

export default Asteroids;
