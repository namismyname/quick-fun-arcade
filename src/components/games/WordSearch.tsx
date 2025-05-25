
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const WordSearch = () => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [words] = useState(['REACT', 'CODE', 'GAME', 'FUN', 'PLAY']);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<{row: number, col: number}[]>([]);

  const gridSize = 10;

  useEffect(() => {
    generateGrid();
  }, []);

  const generateGrid = () => {
    const newGrid: string[][] = Array(gridSize).fill(null).map(() => 
      Array(gridSize).fill('').map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    );

    // Place words in grid (simplified - just horizontal)
    words.forEach((word, wordIndex) => {
      const row = wordIndex + 1;
      const startCol = Math.floor(Math.random() * (gridSize - word.length));
      
      for (let i = 0; i < word.length; i++) {
        newGrid[row][startCol + i] = word[i];
      }
    });

    setGrid(newGrid);
    setFoundWords([]);
    setSelectedCells([]);
  };

  const handleCellClick = (row: number, col: number) => {
    const cellIndex = selectedCells.findIndex(cell => cell.row === row && cell.col === col);
    
    if (cellIndex !== -1) {
      // Cell already selected, remove it
      setSelectedCells(selectedCells.filter((_, index) => index !== cellIndex));
    } else {
      // Add cell to selection
      setSelectedCells([...selectedCells, {row, col}]);
    }
  };

  const checkForWord = () => {
    if (selectedCells.length < 2) return;

    const selectedLetters = selectedCells.map(cell => grid[cell.row][cell.col]).join('');
    const reversedLetters = selectedLetters.split('').reverse().join('');

    const foundWord = words.find(word => 
      (word === selectedLetters || word === reversedLetters) && !foundWords.includes(word)
    );

    if (foundWord) {
      setFoundWords([...foundWords, foundWord]);
    }
    
    setSelectedCells([]);
  };

  useEffect(() => {
    checkForWord();
  }, [selectedCells]);

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-pink-600 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Word Search</h1>
        
        <div className="mb-4">
          <div className="text-lg mb-2">Find these words:</div>
          <div className="flex flex-wrap gap-2 justify-center">
            {words.map(word => (
              <span 
                key={word} 
                className={`px-2 py-1 rounded ${foundWords.includes(word) ? 'bg-green-500' : 'bg-white/20'}`}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-10 gap-1 bg-white/20 p-4 rounded-lg mb-6">
          {grid.map((row, rowIndex) =>
            row.map((letter, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-8 h-8 border border-white/40 flex items-center justify-center text-sm font-bold cursor-pointer
                  ${isCellSelected(rowIndex, colIndex) ? 'bg-yellow-400 text-black' : 'bg-white/10 hover:bg-white/20'}
                `}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {letter}
              </div>
            ))
          )}
        </div>

        <div className="mb-4 text-lg">
          Found: {foundWords.length} / {words.length}
          {foundWords.length === words.length && " 🎉 All found!"}
        </div>

        <Button onClick={generateGrid} className="w-full">
          New Game
        </Button>
      </div>
    </div>
  );
};

export default WordSearch;
