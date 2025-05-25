
import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";

interface Player {
  x: number;
  y: number;
}

interface FallingObject {
  x: number;
  y: number;
  speed: number;
  type: 'rock' | 'bomb' | 'coin';
}

const AvoidFallingObjects = () => {
  const [player, setPlayer] = useState<Player>({x: 200, y: 350});
  const [objects, setObjects] = useState<FallingObject[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [keys, setKeys] = useState<Set<string>>(new Set());

  const gameWidth = 400;
  const gameHeight = 400;
  const playerSize = 30;

  const startGame = () => {
    setPlayer({x: 200, y: 350});
    setObjects([]);
    setScore(0);
    setLives(3);
    setGameRunning(true);
    setGameOver(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => new Set(prev).add(e.code));
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
  }, []);

  useEffect(() => {
    if (!gameRunning || gameOver) return;

    const gameLoop = setInterval(() => {
      // Update player
      setPlayer(prev => {
        let newX = prev.x;
        if (keys.has('ArrowLeft')) newX -= 5;
        if (keys.has('ArrowRight')) newX += 5;
        newX = Math.max(playerSize/2, Math.min(gameWidth - playerSize/2, newX));
        return {x: newX, y: prev.y};
      });

      // Add new objects
      if (Math.random() < 0.03) {
        const objectTypes: FallingObject['type'][] = ['rock', 'bomb', 'coin'];
        const type = objectTypes[Math.floor(Math.random() * objectTypes.length)];
        setObjects(prev => [...prev, {
          x: Math.random() * (gameWidth - 20) + 10,
          y: -20,
          speed: 2 + Math.random() * 3,
          type
        }]);
      }

      // Update objects
      setObjects(prev => prev.map(obj => ({
        ...obj,
        y: obj.y + obj.speed
      })).filter(obj => obj.y < gameHeight + 20));

      // Check collisions
      setObjects(prev => {
        const remainingObjects: FallingObject[] = [];
        let scoreChange = 0;
        let liveChange = 0;

        prev.forEach(obj => {
          const distance = Math.sqrt(
            Math.pow(obj.x - player.x, 2) + Math.pow(obj.y - player.y, 2)
          );

          if (distance < (playerSize + 15) / 2) {
            // Collision detected
            switch (obj.type) {
              case 'coin':
                scoreChange += 10;
                break;
              case 'rock':
                liveChange -= 1;
                break;
              case 'bomb':
                liveChange -= 2;
                break;
            }
          } else {
            remainingObjects.push(obj);
          }
        });

        if (scoreChange > 0) setScore(s => s + scoreChange);
        if (liveChange < 0) {
          setLives(l => {
            const newLives = l + liveChange;
            if (newLives <= 0) {
              setGameOver(true);
              setGameRunning(false);
            }
            return Math.max(0, newLives);
          });
        }

        return remainingObjects;
      });

      // Increase score over time
      setScore(prev => prev + 1);

    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameRunning, gameOver, keys, player]);

  const getObjectEmoji = (type: FallingObject['type']) => {
    switch (type) {
      case 'rock': return '🪨';
      case 'bomb': return '💣';
      case 'coin': return '🪙';
    }
  };

  const getObjectColor = (type: FallingObject['type']) => {
    switch (type) {
      case 'rock': return 'bg-gray-600';
      case 'bomb': return 'bg-red-600';
      case 'coin': return 'bg-yellow-500';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Avoid Falling Objects</h1>
        
        <div className="mb-4 flex justify-between text-xl">
          <div>Score: {score}</div>
          <div>Lives: {Array(lives).fill('❤️').join('')}</div>
        </div>

        <div 
          className="relative bg-gradient-to-b from-sky-400 to-sky-600 border-4 border-white/40 rounded-lg overflow-hidden"
          style={{width: gameWidth, height: gameHeight}}
        >
          {/* Player */}
          {gameRunning && !gameOver && (
            <div
              className="absolute bg-green-500 border-2 border-green-700 rounded-full flex items-center justify-center text-lg"
              style={{
                left: player.x - playerSize/2,
                top: player.y - playerSize/2,
                width: playerSize,
                height: playerSize
              }}
            >
              😊
            </div>
          )}

          {/* Falling Objects */}
          {objects.map((obj, index) => (
            <div
              key={index}
              className={`absolute rounded-full border-2 flex items-center justify-center text-lg ${getObjectColor(obj.type)}`}
              style={{
                left: obj.x - 15,
                top: obj.y - 15,
                width: 30,
                height: 30
              }}
            >
              {getObjectEmoji(obj.type)}
            </div>
          ))}

          {gameOver && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold mb-4">Game Over!</div>
                <div className="text-xl">Final Score: {score}</div>
                <div className="text-sm mt-2">Collect coins, avoid rocks and bombs!</div>
              </div>
            </div>
          )}

          {!gameRunning && !gameOver && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">Avoid Falling Objects!</div>
                <div className="text-sm mb-4">
                  🪙 Collect coins (+10 points)<br/>
                  🪨 Avoid rocks (-1 life)<br/>
                  💣 Avoid bombs (-2 lives)<br/>
                  Use arrow keys to move
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-300">
          Use left and right arrow keys to move
        </div>

        <Button onClick={startGame} className="w-full mt-4">
          {gameRunning ? 'Restart' : 'Start Game'}
        </Button>
      </div>
    </div>
  );
};

export default AvoidFallingObjects;
