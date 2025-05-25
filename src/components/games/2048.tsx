
import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";

const Game2048 = () => {
  const [board, setBoard] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const initializeBoard = useCallback(() => {
    const newBoard = Array(4).fill(null).map(() => Array(4).fill(0));
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    return newBoard;
  }, []);

  const addRandomTile = (board: number[][]) => {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }
    
    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const startNewGame = () => {
    setBoard(initializeBoard());
    setScore(0);
    setGameOver(false);
    setGameWon(false);
  };

  useEffect(() => {
    startNewGame();
  }, [initializeBoard]);

  const move = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver || gameWon) return;

    const newBoard = board.map(row => [...row]);
    let moved = false;
    let newScore = score;

    const moveRow = (row: number[]) => {
      const filtered = row.filter(val => val !== 0);
      const merged = [];
      let i = 0;
      
      while (i < filtered.length) {
        if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
          merged.push(filtered[i] * 2);
          newScore += filtered[i] * 2;
          i += 2;
        } else {
          merged.push(filtered[i]);
          i++;
        }
      }
      
      while (merged.length < 4) {
        merged.push(0);
      }
      
      return merged;
    };

    if (direction === 'left') {
      for (let i = 0; i < 4; i++) {
        const newRow = moveRow(newBoard[i]);
        if (JSON.stringify(newRow) !== JSON.stringify(newBoard[i])) moved = true;
        newBoard[i] = newRow;
      }
    } else if (direction === 'right') {
      for (let i = 0; i < 4; i++) {
        const newRow = moveRow([...newBoard[i]].reverse()).reverse();
        if (JSON.stringify(newRow) !== JSON.stringify(newBoard[i])) moved = true;
        newBoard[i] = newRow;
      }
    } else if (direction === 'up') {
      for (let j = 0; j < 4; j++) {
        const column = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]];
        const newColumn = moveRow(column);
        if (JSON.stringify(newColumn) !== JSON.stringify(column)) moved = true;
        for (let i = 0; i < 4; i++) {
          newBoard[i][j] = newColumn[i];
        }
      }
    } else if (direction === 'down') {
      for (let j = 0; j < 4; j++) {
        const column = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]];
        const newColumn = moveRow([...column].reverse()).reverse();
        if (JSON.stringify(newColumn) !== JSON.stringify(column)) moved = true;
        for (let i = 0; i < 4; i++) {
          newBoard[i][j] = newColumn[i];
        }
      }
    }

    if (moved) {
      addRandomTile(newBoard);
      setBoard(newBoard);
      setScore(newScore);

      // Check for 2048
      if (newBoard.flat().includes(2048)) {
        setGameWon(true);
      }

      // Check for game over
      const hasEmptyCell = newBoard.flat().includes(0);
      if (!hasEmptyCell) {
        let canMove = false;
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            if ((i < 3 && newBoard[i][j] === newBoard[i + 1][j]) ||
                (j < 3 && newBoard[i][j] === newBoard[i][j + 1])) {
              canMove = true;
              break;
            }
          }
          if (canMove) break;
        }
        if (!canMove) {
          setGameOver(true);
        }
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          move('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          move('down');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          move('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          move('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [board, gameOver, gameWon, score]);

  const getTileColor = (value: number) => {
    const colors: {[key: number]: string} = {
      2: 'bg-gray-200 text-gray-800',
      4: 'bg-gray-300 text-gray-800',
      8: 'bg-orange-200 text-white',
      16: 'bg-orange-300 text-white',
      32: 'bg-orange-400 text-white',
      64: 'bg-orange-500 text-white',
      128: 'bg-yellow-300 text-white',
      256: 'bg-yellow-400 text-white',
      512: 'bg-yellow-500 text-white',
      1024: 'bg-red-400 text-white',
      2048: 'bg-red-500 text-white'
    };
    return colors[value] || 'bg-red-600 text-white';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 text-gray-800 p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">2048</h1>
        
        <div className="mb-4 text-xl">Score: {score}</div>

        <div className="grid grid-cols-4 gap-2 p-4 bg-gray-500 rounded-lg mb-6 max-w-xs">
          {board.flat().map((value, index) => (
            <div
              key={index}
              className={`
                w-16 h-16 rounded flex items-center justify-center font-bold text-lg
                ${value === 0 ? 'bg-gray-400' : getTileColor(value)}
              `}
            >
              {value !== 0 ? value : ''}
            </div>
          ))}
        </div>

        {gameWon && (
          <div className="mb-4 text-2xl font-bold text-green-600">
            🎉 You reached 2048! You won!
          </div>
        )}

        {gameOver && (
          <div className="mb-4 text-2xl font-bold text-red-600">
            Game Over! No more moves available.
          </div>
        )}

        <div className="mb-4 text-sm">
          Use arrow keys to move tiles
        </div>

        <Button onClick={startNewGame} className="w-full">
          New Game
        </Button>
      </div>
    </div>
  );
};

export default Game2048;
