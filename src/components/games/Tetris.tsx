
import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";

const Tetris = () => {
  const [board, setBoard] = useState(Array(20).fill(null).map(() => Array(10).fill(0)));
  const [currentPiece, setCurrentPiece] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const pieces = [
    {shape: [[1,1,1,1]], color: 'cyan'}, // I
    {shape: [[1,1],[1,1]], color: 'yellow'}, // O
    {shape: [[0,1,0],[1,1,1]], color: 'purple'}, // T
    {shape: [[0,1,1],[1,1,0]], color: 'green'}, // S
    {shape: [[1,1,0],[0,1,1]], color: 'red'}, // Z
    {shape: [[1,0,0],[1,1,1]], color: 'orange'}, // L
    {shape: [[0,0,1],[1,1,1]], color: 'blue'} // J
  ];

  const getRandomPiece = useCallback(() => {
    const piece = pieces[Math.floor(Math.random() * pieces.length)];
    return {
      ...piece,
      x: 4,
      y: 0
    };
  }, [pieces]);

  const startGame = () => {
    setBoard(Array(20).fill(null).map(() => Array(10).fill(0)));
    setCurrentPiece(getRandomPiece());
    setScore(0);
    setGameRunning(true);
    setGameOver(false);
  };

  const isValidMove = (piece: any, newX: number, newY: number) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardX = newX + x;
          const boardY = newY + y;
          
          if (boardX < 0 || boardX >= 10 || boardY >= 20 || 
              (boardY >= 0 && board[boardY][boardX])) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const placePiece = () => {
    if (!currentPiece) return;
    
    const newBoard = [...board];
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const boardY = currentPiece.y + y;
          const boardX = currentPiece.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = currentPiece.color;
          }
        }
      }
    }

    // Clear completed lines
    const completedLines = [];
    for (let y = 0; y < 20; y++) {
      if (newBoard[y].every(cell => cell !== 0)) {
        completedLines.push(y);
      }
    }

    completedLines.forEach(line => {
      newBoard.splice(line, 1);
      newBoard.unshift(Array(10).fill(0));
    });

    setScore(prev => prev + completedLines.length * 100);
    setBoard(newBoard);

    const nextPiece = getRandomPiece();
    if (!isValidMove(nextPiece, nextPiece.x, nextPiece.y)) {
      setGameOver(true);
      setGameRunning(false);
    } else {
      setCurrentPiece(nextPiece);
    }
  };

  useEffect(() => {
    if (!gameRunning || !currentPiece) return;

    const interval = setInterval(() => {
      if (isValidMove(currentPiece, currentPiece.x, currentPiece.y + 1)) {
        setCurrentPiece(prev => prev ? {...prev, y: prev.y + 1} : null);
      } else {
        placePiece();
      }
    }, 500);

    return () => clearInterval(interval);
  }, [currentPiece, gameRunning, board]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning || !currentPiece) return;

      switch (e.key) {
        case 'ArrowLeft':
          if (isValidMove(currentPiece, currentPiece.x - 1, currentPiece.y)) {
            setCurrentPiece(prev => prev ? {...prev, x: prev.x - 1} : null);
          }
          break;
        case 'ArrowRight':
          if (isValidMove(currentPiece, currentPiece.x + 1, currentPiece.y)) {
            setCurrentPiece(prev => prev ? {...prev, x: prev.x + 1} : null);
          }
          break;
        case 'ArrowDown':
          if (isValidMove(currentPiece, currentPiece.x, currentPiece.y + 1)) {
            setCurrentPiece(prev => prev ? {...prev, y: prev.y + 1} : null);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPiece, gameRunning, board]);

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.y + y;
            const boardX = currentPiece.x + x;
            if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        }
      }
    }

    return displayBoard;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-700 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Tetris</h1>
        
        <div className="mb-4 text-xl">Score: {score}</div>

        <div className="grid grid-cols-10 gap-0.5 bg-gray-800 p-2 rounded-lg mb-4" style={{width: '300px', height: '600px'}}>
          {renderBoard().flat().map((cell, index) => (
            <div
              key={index}
              className={`w-7 h-7 border border-gray-600 ${
                cell === 0 ? 'bg-gray-900' : 
                cell === 'cyan' ? 'bg-cyan-400' :
                cell === 'yellow' ? 'bg-yellow-400' :
                cell === 'purple' ? 'bg-purple-400' :
                cell === 'green' ? 'bg-green-400' :
                cell === 'red' ? 'bg-red-400' :
                cell === 'orange' ? 'bg-orange-400' :
                cell === 'blue' ? 'bg-blue-400' : 'bg-white'
              }`}
            />
          ))}
        </div>

        {gameOver && (
          <div className="mb-4 text-2xl font-bold text-red-400">
            Game Over!
          </div>
        )}

        <div className="mb-4 text-sm">
          Use arrow keys to move and rotate pieces
        </div>

        <Button onClick={startGame} className="w-full">
          {gameRunning ? 'Restart' : 'Start Game'}
        </Button>
      </div>
    </div>
  );
};

export default Tetris;
