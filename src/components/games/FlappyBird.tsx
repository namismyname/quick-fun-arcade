
import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";

const FlappyBird = () => {
  const [birdY, setBirdY] = useState(250);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<{x: number, topHeight: number}[]>([]);
  const [score, setScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const gravity = 0.6;
  const jumpStrength = -12;
  const pipeWidth = 80;
  const pipeGap = 200;
  const gameWidth = 400;
  const gameHeight = 600;

  const jump = useCallback(() => {
    if (!gameOver) {
      setBirdVelocity(jumpStrength);
      if (!gameRunning) {
        setGameRunning(true);
      }
    }
  }, [gameOver, gameRunning, jumpStrength]);

  const resetGame = () => {
    setBirdY(250);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameRunning(false);
    setGameOver(false);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
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
      // Update bird
      setBirdVelocity(prev => prev + gravity);
      setBirdY(prev => {
        const newY = prev + birdVelocity;
        if (newY <= 0 || newY >= gameHeight - 40) {
          setGameOver(true);
          setGameRunning(false);
        }
        return newY;
      });

      // Update pipes
      setPipes(prev => {
        const newPipes = prev.map(pipe => ({...pipe, x: pipe.x - 3}))
          .filter(pipe => pipe.x > -pipeWidth);

        // Add new pipe
        if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < gameWidth - 200) {
          newPipes.push({
            x: gameWidth,
            topHeight: Math.random() * (gameHeight - pipeGap - 100) + 50
          });
        }

        // Check collision and score
        newPipes.forEach(pipe => {
          const birdLeft = 50;
          const birdRight = 90;
          const birdTop = birdY;
          const birdBottom = birdY + 40;

          if (birdRight > pipe.x && birdLeft < pipe.x + pipeWidth) {
            if (birdTop < pipe.topHeight || birdBottom > pipe.topHeight + pipeGap) {
              setGameOver(true);
              setGameRunning(false);
            }
          }

          // Score when passing pipe
          if (pipe.x + pipeWidth < birdLeft && pipe.x + pipeWidth >= birdLeft - 3) {
            setScore(s => s + 1);
          }
        });

        return newPipes;
      });
    }, 20);

    return () => clearInterval(gameLoop);
  }, [gameRunning, gameOver, birdVelocity, birdY]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-green-400 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Flappy Bird</h1>
        
        <div className="mb-4 text-xl">Score: {score}</div>

        <div 
          className="relative bg-sky-300 border-4 border-white/40 rounded-lg overflow-hidden cursor-pointer"
          style={{width: gameWidth, height: gameHeight}}
          onClick={jump}
        >
          {/* Bird */}
          <div
            className="absolute w-10 h-10 bg-yellow-400 rounded-full border-2 border-orange-400 transition-all duration-75"
            style={{
              left: 50,
              top: birdY,
              transform: `rotate(${Math.min(Math.max(birdVelocity * 3, -30), 30)}deg)`
            }}
          >
            <div className="absolute w-2 h-2 bg-black rounded-full top-2 right-2"></div>
          </div>

          {/* Pipes */}
          {pipes.map((pipe, index) => (
            <div key={index}>
              {/* Top pipe */}
              <div
                className="absolute bg-green-600 border-2 border-green-800"
                style={{
                  left: pipe.x,
                  top: 0,
                  width: pipeWidth,
                  height: pipe.topHeight
                }}
              ></div>
              {/* Bottom pipe */}
              <div
                className="absolute bg-green-600 border-2 border-green-800"
                style={{
                  left: pipe.x,
                  top: pipe.topHeight + pipeGap,
                  width: pipeWidth,
                  height: gameHeight - pipe.topHeight - pipeGap
                }}
              ></div>
            </div>
          ))}

          {/* Ground */}
          <div className="absolute bottom-0 w-full h-20 bg-green-500"></div>

          {/* Game over overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold mb-4">Game Over!</div>
                <div className="text-xl">Final Score: {score}</div>
              </div>
            </div>
          )}

          {/* Start message */}
          {!gameRunning && !gameOver && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">Click or Press Space to Start!</div>
                <div className="text-lg">🐦 Avoid the pipes!</div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-300">
          Click the game area or press spacebar to flap
        </div>

        <Button onClick={resetGame} className="w-full mt-4">
          New Game
        </Button>
      </div>
    </div>
  );
};

export default FlappyBird;
