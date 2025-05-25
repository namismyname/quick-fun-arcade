
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

const Minesweeper = () => {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [mineCount, setMineCount] = useState(10);

  const rows = 9;
  const cols = 9;
  const mines = 10;

  useEffect(() => {
    initializeBoard();
  }, []);

  const initializeBoard = () => {
    const newBoard: Cell[][] = Array(rows).fill(null).map(() =>
      Array(cols).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor mines
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newBoard[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].isMine) {
                count++;
              }
            }
          }
          newBoard[r][c].neighborMines = count;
        }
      }
    }

    setBoard(newBoard);
    setGameStatus('playing');
    setMineCount(mines);
  };

  const revealCell = (row: number, col: number) => {
    if (gameStatus !== 'playing' || board[row][col].isRevealed || board[row][col].isFlagged) return;

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    
    if (newBoard[row][col].isMine) {
      setGameStatus('lost');
      // Reveal all mines
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (newBoard[r][c].isMine) {
            newBoard[r][c].isRevealed = true;
          }
        }
      }
    } else {
      const toReveal = [[row, col]];
      const visited = new Set();

      while (toReveal.length > 0) {
        const [r, c] = toReveal.pop()!;
        const key = `${r}-${c}`;
        
        if (visited.has(key) || r < 0 || r >= rows || c < 0 || c >= cols) continue;
        visited.add(key);

        newBoard[r][c].isRevealed = true;

        if (newBoard[r][c].neighborMines === 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              toReveal.push([r + dr, c + dc]);
            }
          }
        }
      }
    }

    setBoard(newBoard);
  };

  const toggleFlag = (row: number, col: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (gameStatus !== 'playing' || board[row][col].isRevealed) return;

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    
    setMineCount(mines - newBoard.flat().filter(cell => cell.isFlagged).length);
    setBoard(newBoard);
  };

  const getCellDisplay = (cell: Cell) => {
    if (cell.isFlagged) return '🚩';
    if (!cell.isRevealed) return '';
    if (cell.isMine) return '💣';
    if (cell.neighborMines === 0) return '';
    return cell.neighborMines.toString();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-600 to-gray-800 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Minesweeper</h1>
        
        <div className="mb-4 text-xl">
          Mines: {mineCount} | Status: {gameStatus}
        </div>

        <div className="grid grid-cols-9 gap-1 bg-white/20 p-4 rounded-lg mb-6">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-8 h-8 border border-white/40 flex items-center justify-center text-sm font-bold cursor-pointer
                  ${cell.isRevealed ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'}
                  ${cell.isMine && cell.isRevealed ? 'bg-red-500' : ''}
                `}
                onClick={() => revealCell(rowIndex, colIndex)}
                onContextMenu={(e) => toggleFlag(rowIndex, colIndex, e)}
              >
                {getCellDisplay(cell)}
              </div>
            ))
          )}
        </div>

        <Button onClick={initializeBoard} className="w-full">
          New Game
        </Button>
      </div>
    </div>
  );
};

export default Minesweeper;
