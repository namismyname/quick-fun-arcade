
import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";

interface Dino {
  y: number;
  velocity: number;
  isJumping: boolean;
}

interface Obstacle {
  x: number;
  width: number;
  height: number;
}

const DinoGame = () => {
  const [dino, setDino] = useState<Dino>({y: 0, velocity: 0, isJumping: false});
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const gameWidth = 600;
  const gameHeight = 300;
  const groundHeight = 50;
  const dinoWidth = 40;
  const dinoHeight = 40;
  const gravity = 0.8;
  const jumpStrength = -15;

  const jump = useCallback(() => {
    if (!gameOver && !dino.isJumping) {
      setDino(prev => ({
        ...prev,
        velocity: jumpStrength,
        isJumping: true
      }));
      if (!gameRunning) {
        setGameRunning(true);
      }
    }
  }, [gameOver, dino.isJumping, gameRunning]);

  const resetGame = () => {
    setDino({y: 0, velocity: 0, isJumping: false});
    setObstacles([]);
    setScore(0);
    setGameRunning(false);
    setGameOver(false);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  useEffect(() => {
    if (!gameRunning || gameOver) return;

    const gameLoop = setInterval(() => {
      // Update dino
      setDino(prev => {
        let newDino = {...prev};
        newDino.velocity += gravity;
        newDino.y += newDino.velocity;

        // Ground collision
        if (newDino.y >= 0) {
          newDino.y = 0;
          newDino.velocity = 0;
          newDino.isJumping = false;
        }

        return newDino;
      });

      // Update obstacles
      setObstacles(prev => {
        const newObstacles = prev.map(obstacle => ({
          ...obstacle,
          x: obstacle.x - 5
        })).filter(obstacle => obstacle.x > -obstacle.width);

        // Add new obstacles
        if (newObstacles.length === 0 || newObstacles[newObstacles.length - 1].x < gameWidth - 200) {
          const height = 30 + Math.random() * 30;
          newObstacles.push({
            x: gameWidth,
            width: 20,
            height: height
          });
        }

        return newObstacles;
      });

      // Update score
      setScore(prev => prev + 1);

      // Check collisions
      setObstacles(currentObstacles => {
        const dinoLeft = 50;
        const dinoRight = dinoLeft + dinoWidth;
        const dinoTop = gameHeight - groundHeight - dinoHeight - dino.y;
        const dinoBottom = dinoTop + dinoHeight;

        for (const obstacle of currentObstacles) {
          const obstacleLeft = obstacle.x;
          const obstacleRight = obstacle.x + obstacle.width;
          const obstacleTop = gameHeight - groundHeight - obstacle.height;
          const obstacleBottom = gameHeight - groundHeight;

          if (dinoRight > obstacleLeft && dinoLeft < obstacleRight &&
              dinoBottom > obstacleTop && dinoTop < obstacleBottom) {
            setGameOver(true);
            setGameRunning(false);
          }
        }

        return currentObstacles;
      });

    }, 20);

    return () => clearInterval(gameLoop);
  }, [gameRunning, gameOver, dino.y]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-200 to-orange-300 text-gray-800 p-4">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Dino Runner</h1>
        
        <div className="mb-4 text-xl text-gray-700">Score: {score}</div>

        <div 
          className="relative bg-gradient-to-b from-blue-200 to-yellow-100 border-4 border-gray-400 rounded-lg overflow-hidden cursor-pointer"
          style={{width: gameWidth, height: gameHeight}}
          onClick={jump}
        >
          {/* Ground */}
          <div 
            className="absolute bottom-0 w-full bg-green-400 border-t-2 border-green-600"
            style={{height: groundHeight}}
          ></div>

          {/* Dino */}
          <div
            className="absolute bg-green-600 border-2 border-green-800 rounded"
            style={{
              left: 50,
              bottom: groundHeight - dino.y,
              width: dinoWidth,
              height: dinoHeight
            }}
          >
            {/* Simple dino face */}
            <div className="absolute w-2 h-2 bg-white rounded-full top-1 left-1"></div>
            <div className="absolute w-1 h-1 bg-black rounded-full top-1.5 left-1.5"></div>
          </div>

          {/* Obstacles */}
          {obstacles.map((obstacle, index) => (
            <div
              key={index}
              className="absolute bg-red-600 border-2 border-red-800"
              style={{
                left: obstacle.x,
                bottom: groundHeight,
                width: obstacle.width,
                height: obstacle.height
              }}
            ></div>
          ))}

          {/* Clouds */}
          <div className="absolute top-10 left-20 w-12 h-6 bg-white/60 rounded-full"></div>
          <div className="absolute top-20 right-20 w-16 h-8 bg-white/60 rounded-full"></div>

          {gameOver && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-3xl font-bold mb-4">Game Over!</div>
                <div className="text-xl">Final Score: {score}</div>
              </div>
            </div>
          )}

          {!gameRunning && !gameOver && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-2xl font-bold mb-2">🦕 Dino Runner!</div>
                <div className="text-lg">Click or Press Space/Up to Jump!</div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Click the game area or press space/up arrow to jump over obstacles
        </div>

        <Button onClick={resetGame} className="w-full mt-4">
          New Game
        </Button>
      </div>
    </div>
  );
};

export default DinoGame;
