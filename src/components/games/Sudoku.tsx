
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const Sudoku = () => {
  const [board, setBoard] = useState<number[][]>([]);
  const [initialBoard, setInitialBoard] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);

  // Simple Sudoku puzzle (for demo)
  const puzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ];

  useEffect(() => {
    setBoard(puzzle.map(row => [...row]));
    setInitialBoard(puzzle.map(row => [...row]));
  }, []);

  const handleCellClick = (row: number, col: number) => {
    if (initialBoard[row] && initialBoard[row][col] === 0) {
      setSelectedCell({row, col});
    }
  };

  const handleNumberInput = (number: number) => {
    if (selectedCell) {
      const newBoard = board.map(row => [...row]);
      newBoard[selectedCell.row][selectedCell.col] = number;
      setBoard(newBoard);
    }
  };

  const resetGame = () => {
    setBoard(puzzle.map(row => [...row]));
    setSelectedCell(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Sudoku</h1>
        
        <div className="grid grid-cols-9 gap-1 bg-white/20 p-4 rounded-lg mb-6">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-8 h-8 border border-white/40 flex items-center justify-center text-sm font-bold cursor-pointer
                  ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? 'bg-yellow-400 text-black' : ''}
                  ${initialBoard[rowIndex][colIndex] !== 0 ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'}
                `}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell !== 0 ? cell : ''}
              </div>
            ))
          )}
        </div>

        <div className="grid grid-cols-5 gap-2 mb-6 max-w-xs mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
            <Button
              key={number}
              onClick={() => handleNumberInput(number)}
              disabled={!selectedCell}
              className="w-12 h-12"
            >
              {number}
            </Button>
          ))}
          <Button
            onClick={() => handleNumberInput(0)}
            disabled={!selectedCell}
            className="w-12 h-12"
          >
            Clear
          </Button>
        </div>

        <Button onClick={resetGame} className="w-full">
          Reset
        </Button>
      </div>
    </div>
  );
};

export default Sudoku;
