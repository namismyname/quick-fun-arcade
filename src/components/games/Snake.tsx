
import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";

const Snake = () => {
  const [snake, setSnake] = useState([{x: 10, y: 10}]);
  const [food, setFood] = useState({x: 5, y: 5});
  const [direction, setDirection] = useState({x: 0, y: 0});
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);

  const gridSize = 20;

  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
  }, []);

  const startGame = () => {
    setSnake([{x: 10, y: 10}]);
    setFood(generateFood());
    setDirection({x: 1, y: 0});
    setGameRunning(true);
    setScore(0);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning) return;
      
      switch(e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({x: 0, y: -1});
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({x: 0, y: 1});
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({x: -1, y: 0});
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({x: 1, y: 0});
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameRunning]);

  useEffect(() => {
    if (!gameRunning) return;

    const gameLoop = setInterval(() => {
      setSnake(currentSnake => {
        const newSnake = [...currentSnake];
        const head = {
          x: newSnake[0].x + direction.x,
          y: newSnake[0].y + direction.y
        };

        if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
          setGameRunning(false);
          return currentSnake;
        }

        if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameRunning(false);
          return currentSnake;
        }

        newSnake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 1);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 200);

    return () => clearInterval(gameLoop);
  }, [direction, food, gameRunning, generateFood]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-500 to-blue-600 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Snake Game</h1>
        
        <div className="mb-4 text-xl">Score: {score}</div>

        <div 
          className="grid bg-gray-800 border-4 border-white/40 rounded-lg mb-6"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            width: '400px',
            height: '400px'
          }}
        >
          {Array.from({length: gridSize * gridSize}).map((_, index) => {
            const x = index % gridSize;
            const y = Math.floor(index / gridSize);
            const isSnake = snake.some(segment => segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;
            
            return (
              <div
                key={index}
                className={`
                  ${isSnake ? 'bg-green-400' : ''}
                  ${isFood ? 'bg-red-400' : ''}
                  ${!isSnake && !isFood ? 'bg-gray-700' : ''}
                `}
              />
            );
          })}
        </div>

        <div className="mb-4 text-sm">Use arrow keys to control the snake</div>

        <Button onClick={startGame} className="w-full">
          {gameRunning ? 'Restart' : 'Start Game'}
        </Button>
      </div>
    </div>
  );
};

export default Snake;
