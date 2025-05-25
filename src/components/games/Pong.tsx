
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

const Pong = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState({player: 0, computer: 0});

  const gameState = useRef({
    ball: {x: 300, y: 200, dx: 5, dy: 3, radius: 10},
    playerPaddle: {x: 10, y: 150, width: 10, height: 100},
    computerPaddle: {x: 580, y: 150, width: 10, height: 100}
  });

  const startGame = () => {
    gameState.current.ball = {x: 300, y: 200, dx: 5, dy: 3, radius: 10};
    gameState.current.playerPaddle = {x: 10, y: 150, width: 10, height: 100};
    gameState.current.computerPaddle = {x: 580, y: 150, width: 10, height: 100};
    setScore({player: 0, computer: 0});
    setGameRunning(true);
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

      // Ball collision with top and bottom walls
      if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
      }

      // Ball collision with paddles
      const playerPaddle = gameState.current.playerPaddle;
      const computerPaddle = gameState.current.computerPaddle;

      if (ball.x - ball.radius < playerPaddle.x + playerPaddle.width &&
          ball.y > playerPaddle.y && ball.y < playerPaddle.y + playerPaddle.height) {
        ball.dx = -ball.dx;
        ball.x = playerPaddle.x + playerPaddle.width + ball.radius;
      }

      if (ball.x + ball.radius > computerPaddle.x &&
          ball.y > computerPaddle.y && ball.y < computerPaddle.y + computerPaddle.height) {
        ball.dx = -ball.dx;
        ball.x = computerPaddle.x - ball.radius;
      }

      // Ball goes off screen (scoring)
      if (ball.x < 0) {
        setScore(prev => ({...prev, computer: prev.computer + 1}));
        ball.x = 300;
        ball.y = 200;
        ball.dx = 5;
        ball.dy = Math.random() * 6 - 3;
      } else if (ball.x > canvas.width) {
        setScore(prev => ({...prev, player: prev.player + 1}));
        ball.x = 300;
        ball.y = 200;
        ball.dx = -5;
        ball.dy = Math.random() * 6 - 3;
      }

      // Computer AI - simple following
      const computerCenter = computerPaddle.y + computerPaddle.height / 2;
      if (ball.y < computerCenter) {
        computerPaddle.y = Math.max(0, computerPaddle.y - 4);
      } else if (ball.y > computerCenter) {
        computerPaddle.y = Math.min(canvas.height - computerPaddle.height, computerPaddle.y + 4);
      }

      // Draw everything
      ctx.fillStyle = '#fff';
      
      // Draw ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw paddles
      ctx.fillRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);
      ctx.fillRect(computerPaddle.x, computerPaddle.y, computerPaddle.width, computerPaddle.height);

      // Draw center line
      ctx.setLineDash([5, 15]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
    };

    const interval = setInterval(gameLoop, 16);
    return () => clearInterval(interval);
  }, [gameRunning]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas || !gameRunning) return;
      
      const rect = canvas.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      gameState.current.playerPaddle.y = Math.max(0, Math.min(mouseY - 50, canvas.height - 100));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [gameRunning]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-black text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Pong</h1>
        
        <div className="mb-4 text-xl">
          Player {score.player} - {score.computer} Computer
        </div>

        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="border-4 border-white/40 rounded-lg mb-4 bg-black"
        />

        <div className="mb-4 text-sm">
          Move your mouse to control the left paddle
        </div>

        <Button onClick={startGame} className="w-full">
          {gameRunning ? 'Restart' : 'Start Game'}
        </Button>
      </div>
    </div>
  );
};

export default Pong;
