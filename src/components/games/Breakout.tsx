
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

const Breakout = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameWon, setGameWon] = useState(false);

  const gameState = useRef({
    ball: {x: 300, y: 400, dx: 3, dy: -3, radius: 8},
    paddle: {x: 250, width: 100, height: 10, y: 450},
    bricks: [] as {x: number, y: number, width: number, height: number, destroyed: boolean}[]
  });

  const initializeBricks = () => {
    const bricks = [];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 10; col++) {
        bricks.push({
          x: col * 60 + 10,
          y: row * 30 + 50,
          width: 50,
          height: 20,
          destroyed: false
        });
      }
    }
    gameState.current.bricks = bricks;
  };

  const startGame = () => {
    gameState.current.ball = {x: 300, y: 400, dx: 3, dy: -3, radius: 8};
    gameState.current.paddle = {x: 250, width: 100, height: 10, y: 450};
    initializeBricks();
    setGameRunning(true);
    setScore(0);
    setLives(3);
    setGameWon(false);
  };

  useEffect(() => {
    if (!gameRunning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update ball position
      const ball = gameState.current.ball;
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Ball collision with walls
      if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
      }
      if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
      }

      // Ball collision with paddle
      const paddle = gameState.current.paddle;
      if (ball.y + ball.radius > paddle.y && 
          ball.x > paddle.x && 
          ball.x < paddle.x + paddle.width) {
        ball.dy = -ball.dy;
      }

      // Ball falls below paddle
      if (ball.y > canvas.height) {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameRunning(false);
          } else {
            ball.x = 300;
            ball.y = 400;
            ball.dx = 3;
            ball.dy = -3;
          }
          return newLives;
        });
      }

      // Ball collision with bricks
      gameState.current.bricks.forEach(brick => {
        if (!brick.destroyed &&
            ball.x > brick.x && ball.x < brick.x + brick.width &&
            ball.y > brick.y && ball.y < brick.y + brick.height) {
          ball.dy = -ball.dy;
          brick.destroyed = true;
          setScore(prev => prev + 10);
        }
      });

      // Check win condition
      if (gameState.current.bricks.every(brick => brick.destroyed)) {
        setGameWon(true);
        setGameRunning(false);
      }

      // Draw ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();

      // Draw paddle
      ctx.fillStyle = '#fff';
      ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

      // Draw bricks
      gameState.current.bricks.forEach(brick => {
        if (!brick.destroyed) {
          ctx.fillStyle = '#ff6b6b';
          ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        }
      });
    };

    const interval = setInterval(gameLoop, 16);
    return () => clearInterval(interval);
  }, [gameRunning]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas || !gameRunning) return;
      
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      gameState.current.paddle.x = Math.max(0, Math.min(mouseX - gameState.current.paddle.width / 2, canvas.width - gameState.current.paddle.width));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [gameRunning]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Breakout</h1>
        
        <div className="mb-4 grid grid-cols-2 gap-4 text-xl">
          <div>Score: {score}</div>
          <div>Lives: {lives}</div>
        </div>

        <canvas
          ref={canvasRef}
          width={600}
          height={500}
          className="border-4 border-white/40 rounded-lg mb-4 bg-black"
        />

        {gameWon && (
          <div className="mb-4 text-2xl font-bold text-green-400">
            🎉 You Won! All bricks destroyed!
          </div>
        )}

        <div className="mb-4 text-sm">
          Move your mouse to control the paddle
        </div>

        <Button onClick={startGame} className="w-full">
          {gameRunning ? 'Restart' : 'Start Game'}
        </Button>
      </div>
    </div>
  );
};

export default Breakout;
