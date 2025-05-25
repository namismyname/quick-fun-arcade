
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const Game2048 = () => {
  const [board, setBoard] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const newBoard = Array(4).fill(null).map(() => Array(4).fill(0));
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
  };

  const addRandomTile = (board: number[][]) => {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          emptyCells.push({row: i, col: j});
        }
      }
    }
    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const move = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return;
    
    const newBoard = board.map(row => [...row]);
    let moved = false;
    
    // Simple movement logic (simplified for demo)
    if (direction === 'left') {
      for (let i = 0; i < 4; i++) {
        const row = newBoard[i].filter(cell => cell !== 0);
        for (let j = 0; j < row.length - 1; j++) {
          if (row[j] === row[j + 1]) {
            row[j] *= 2;
            setScore(prev => prev + row[j]);
            row.splice(j + 1, 1);
          }
        }
        while (row.length < 4) row.push(0);
        if (JSON.stringify(row) !== JSON.stringify(newBoard[i])) moved = true;
        newBoard[i] = row;
      }
    }
    
    if (moved) {
      addRandomTile(newBoard);
      setBoard(newBoard);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowLeft': move('left'); break;
        case 'ArrowRight': move('right'); break;
        case 'ArrowUp': move('up'); break;
        case 'ArrowDown': move('down'); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [board]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-500 to-red-600 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">2048</h1>
        
        <div className="mb-4 text-xl">Score: {score}</div>

        <div className="grid grid-cols-4 gap-2 bg-white/20 p-4 rounded-lg mb-6">
          {board.map((row, i) =>
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`w-16 h-16 rounded flex items-center justify-center text-lg font-bold
                  ${cell === 0 ? 'bg-white/20' : 
                    cell === 2 ? 'bg-yellow-200 text-gray-800' :
                    cell === 4 ? 'bg-yellow-300 text-gray-800' :
                    cell === 8 ? 'bg-orange-300 text-white' :
                    cell === 16 ? 'bg-orange-400 text-white' :
                    'bg-red-500 text-white'}`}
              >
                {cell !== 0 ? cell : ''}
              </div>
            ))
          )}
        </div>

        <div className="mb-4 text-sm">Use arrow keys to move tiles</div>

        <Button onClick={initializeGame} className="w-full">
          New Game
        </Button>
      </div>
    </div>
  );
};

export default Game2048;
