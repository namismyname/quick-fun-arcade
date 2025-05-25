
import { useState } from 'react';
import { Button } from "@/components/ui/button";

const NumberGuessing = () => {
  const [targetNumber, setTargetNumber] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const makeGuess = () => {
    const guessNum = parseInt(guess);
    if (isNaN(guessNum)) return;

    setAttempts(prev => prev + 1);
    
    if (guessNum === targetNumber) {
      setMessage(`🎉 Correct! You got it in ${attempts + 1} attempts!`);
      setGameWon(true);
    } else if (guessNum < targetNumber) {
      setMessage('📈 Too low! Try higher.');
    } else {
      setMessage('📉 Too high! Try lower.');
    }
    setGuess('');
  };

  const resetGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setMessage('');
    setAttempts(0);
    setGameWon(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center max-w-md w-full">
        <h1 className="text-4xl font-bold mb-6">Number Guessing</h1>
        
        <div className="mb-6">
          <p className="text-lg mb-4">Guess a number between 1 and 100!</p>
          <div className="text-sm mb-4">Attempts: {attempts}</div>
        </div>

        {!gameWon && (
          <div className="mb-6">
            <input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="w-full p-3 rounded-lg text-black text-center text-xl"
              placeholder="Enter your guess"
              min="1"
              max="100"
            />
            <Button onClick={makeGuess} className="w-full mt-4">
              Make Guess
            </Button>
          </div>
        )}

        {message && (
          <div className="mb-6 text-xl font-bold">
            {message}
          </div>
        )}

        <Button onClick={resetGame} className="w-full" variant="outline">
          New Game
        </Button>
      </div>
    </div>
  );
};

export default NumberGuessing;
