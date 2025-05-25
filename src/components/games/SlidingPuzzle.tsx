
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const SlidingPuzzle = () => {
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const size = 4;

  useEffect(() => {
    initializePuzzle();
  }, []);

  const initializePuzzle = () => {
    const numbers = Array.from({length: size * size - 1}, (_, i) => i + 1);
    numbers.push(0); // 0 represents empty space
    
    // Shuffle the array
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    
    setTiles(numbers);
    setMoves(0);
    setIsWon(false);
  };

  const canMove = (index: number) => {
    const emptyIndex = tiles.indexOf(0);
    const row = Math.floor(index / size);
    const col = index % size;
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;

    return (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    );
  };

  const moveTile = (index: number) => {
    if (!canMove(index) || isWon) return;

    const newTiles = [...tiles];
    const emptyIndex = tiles.indexOf(0);
    
    [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
    
    setTiles(newTiles);
    setMoves(moves + 1);

    // Check if won
    const isComplete = newTiles.slice(0, -1).every((tile, index) => tile === index + 1);
    if (isComplete) {
      setIsWon(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-500 to-blue-600 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Sliding Puzzle</h1>
        
        <div className="mb-4 text-xl">
          Moves: {moves} {isWon && "🎉 Solved!"}
        </div>

        <div className="grid grid-cols-4 gap-2 bg-white/20 p-4 rounded-lg mb-6 w-64 h-64">
          {tiles.map((tile, index) => (
            <div
              key={index}
              className={`
                w-14 h-14 flex items-center justify-center text-xl font-bold rounded cursor-pointer
                ${tile === 0 ? 'bg-transparent' : 'bg-white/30 hover:bg-white/40'}
                ${canMove(index) && tile !== 0 ? 'border-2 border-yellow-400' : ''}
              `}
              onClick={() => moveTile(index)}
            >
              {tile !== 0 ? tile : ''}
            </div>
          ))}
        </div>

        <Button onClick={initializePuzzle} className="w-full">
          New Puzzle
        </Button>
      </div>
    </div>
  );
};

export default SlidingPuzzle;
