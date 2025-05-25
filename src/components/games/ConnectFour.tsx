
import { useState } from 'react';
import { Button } from "@/components/ui/button";

const ConnectFour = () => {
  const [board, setBoard] = useState(Array(6).fill(null).map(() => Array(7).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState<'red' | 'yellow'>('red');
  const [winner, setWinner] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const checkWinner = (board: (string | null)[][], row: number, col: number, player: string) => {
    const directions = [
      [0, 1], [1, 0], [1, 1], [1, -1]
    ];

    for (let [dx, dy] of directions) {
      let count = 1;
      
      // Check positive direction
      for (let i = 1; i < 4; i++) {
        const newRow = row + dx * i;
        const newCol = col + dy * i;
        if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 7 && board[newRow][newCol] === player) {
          count++;
        } else {
          break;
        }
      }
      
      // Check negative direction
      for (let i = 1; i < 4; i++) {
        const newRow = row - dx * i;
        const newCol = col - dy * i;
        if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 7 && board[newRow][newCol] === player) {
          count++;
        } else {
          break;
        }
      }
      
      if (count >= 4) return true;
    }
    
    return false;
  };

  const dropPiece = (col: number) => {
    if (gameOver || winner) return;
    
    const newBoard = [...board];
    
    // Find the lowest empty row in the column
    for (let row = 5; row >= 0; row--) {
      if (!newBoard[row][col]) {
        newBoard[row][col] = currentPlayer;
        
        if (checkWinner(newBoard, row, col, currentPlayer)) {
          setWinner(currentPlayer);
          setGameOver(true);
        } else if (newBoard.every(row => row.every(cell => cell !== null))) {
          setWinner('tie');
          setGameOver(true);
        } else {
          setCurrentPlayer(currentPlayer === 'red' ? 'yellow' : 'red');
        }
        
        setBoard(newBoard);
        return;
      }
    }
  };

  const resetGame = () => {
    setBoard(Array(6).fill(null).map(() => Array(7).fill(null)));
    setCurrentPlayer('red');
    setWinner(null);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Connect Four</h1>
        
        <div className="mb-4 text-xl">
          {winner === 'tie' ? "It's a tie!" : 
           winner ? `${winner.charAt(0).toUpperCase() + winner.slice(1)} wins!` :
           `Current player: ${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}`}
        </div>

        <div className="bg-blue-800 p-4 rounded-lg mb-6 inline-block">
          <div className="grid grid-cols-7 gap-2">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    w-12 h-12 rounded-full border-2 border-white cursor-pointer
                    ${cell === 'red' ? 'bg-red-500' : 
                      cell === 'yellow' ? 'bg-yellow-400' : 'bg-white/20'}
                    hover:bg-white/30 transition-colors
                  `}
                  onClick={() => dropPiece(colIndex)}
                />
              ))
            )}
          </div>
        </div>

        <div className="mb-4 text-sm">
          Click on a column to drop your piece
        </div>

        <Button onClick={resetGame} className="w-full">
          New Game
        </Button>
      </div>
    </div>
  );
};

export default ConnectFour;
