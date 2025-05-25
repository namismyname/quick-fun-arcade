
import { useState } from 'react';
import { Button } from "@/components/ui/button";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const checkWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;
    
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setIsXNext(!isXNext);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-pink-600 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Tic Tac Toe</h1>
        
        <div className="mb-4 text-xl">
          {winner ? `Winner: ${winner}!` : `Next player: ${isXNext ? 'X' : 'O'}`}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6 w-64 h-64">
          {board.map((cell, index) => (
            <button
              key={index}
              className="bg-white/20 hover:bg-white/30 rounded-lg text-4xl font-bold h-20 w-20 flex items-center justify-center transition-all"
              onClick={() => handleClick(index)}
            >
              {cell}
            </button>
          ))}
        </div>

        <Button onClick={resetGame} className="w-full">
          New Game
        </Button>
      </div>
    </div>
  );
};

export default TicTacToe;
