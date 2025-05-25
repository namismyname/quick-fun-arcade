
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NumberGuessing = () => {
  const [targetNumber, setTargetNumber] = useState(0);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts] = useState(10);
  const [feedback, setFeedback] = useState('');
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost' | 'start'>('start');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [range, setRange] = useState({min: 1, max: 100});
  const [guessHistory, setGuessHistory] = useState<{guess: number, feedback: string}[]>([]);

  const startGame = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(selectedDifficulty);
    
    let newRange;
    switch (selectedDifficulty) {
      case 'easy':
        newRange = {min: 1, max: 50};
        break;
      case 'medium':
        newRange = {min: 1, max: 100};
        break;
      case 'hard':
        newRange = {min: 1, max: 500};
        break;
    }
    
    setRange(newRange);
    const target = Math.floor(Math.random() * (newRange.max - newRange.min + 1)) + newRange.min;
    setTargetNumber(target);
    setAttempts(0);
    setGuess('');
    setFeedback('');
    setGameStatus('playing');
    setGuessHistory([]);
  };

  const makeGuess = () => {
    const guessNumber = parseInt(guess);
    
    if (isNaN(guessNumber) || guessNumber < range.min || guessNumber > range.max) {
      setFeedback(`Please enter a number between ${range.min} and ${range.max}`);
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    let newFeedback = '';
    if (guessNumber === targetNumber) {
      newFeedback = '🎉 Correct! You found it!';
      setGameStatus('won');
    } else if (guessNumber < targetNumber) {
      const difference = targetNumber - guessNumber;
      if (difference <= 5) {
        newFeedback = '🔥 Very close! Too low, but you\'re getting hot!';
      } else if (difference <= 15) {
        newFeedback = '📈 Too low, but close!';
      } else {
        newFeedback = '📈 Too low!';
      }
    } else {
      const difference = guessNumber - targetNumber;
      if (difference <= 5) {
        newFeedback = '🔥 Very close! Too high, but you\'re getting hot!';
      } else if (difference <= 15) {
        newFeedback = '📉 Too high, but close!';
      } else {
        newFeedback = '📉 Too high!';
      }
    }

    setFeedback(newFeedback);
    setGuessHistory(prev => [...prev, {guess: guessNumber, feedback: newFeedback}]);

    if (newAttempts >= maxAttempts && guessNumber !== targetNumber) {
      setGameStatus('lost');
      setFeedback(`💀 Game Over! The number was ${targetNumber}`);
    }

    setGuess('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      makeGuess();
    }
  };

  const resetGame = () => {
    setGameStatus('start');
    setGuessHistory([]);
    setFeedback('');
    setGuess('');
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (gameStatus === 'start') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center max-w-md w-full">
          <h1 className="text-4xl font-bold mb-6">🔢 Number Guessing</h1>
          
          <p className="text-lg mb-6">I'm thinking of a number... Can you guess it?</p>
          
          <div className="space-y-4">
            <Button 
              onClick={() => startGame('easy')} 
              className="w-full bg-green-500 hover:bg-green-600 text-lg py-3"
            >
              Easy (1-50) 🟢
            </Button>
            <Button 
              onClick={() => startGame('medium')} 
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-lg py-3"
            >
              Medium (1-100) 🟡
            </Button>
            <Button 
              onClick={() => startGame('hard')} 
              className="w-full bg-red-500 hover:bg-red-600 text-lg py-3"
            >
              Hard (1-500) 🔴
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center max-w-md w-full">
        <h1 className="text-4xl font-bold mb-6">🔢 Number Guessing</h1>
        
        <div className="mb-4">
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(difficulty)}`}>
            {difficulty.toUpperCase()} ({range.min}-{range.max})
          </div>
        </div>

        <div className="mb-6">
          <div className="text-xl mb-2">
            Attempts: {attempts}/{maxAttempts}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{width: `${(attempts / maxAttempts) * 100}%`}}
            ></div>
          </div>
        </div>

        {gameStatus === 'playing' && (
          <div className="space-y-4">
            <div>
              <Input
                type="number"
                placeholder={`Enter a number (${range.min}-${range.max})`}
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-center text-lg"
                min={range.min}
                max={range.max}
              />
            </div>
            <Button onClick={makeGuess} className="w-full text-lg py-3">
              Make Guess 🎯
            </Button>
          </div>
        )}

        {feedback && (
          <div className="mt-4 p-3 bg-white/20 rounded-lg">
            <div className="text-lg font-bold">{feedback}</div>
          </div>
        )}

        {gameStatus === 'won' && (
          <div className="mt-6 space-y-4">
            <div className="text-2xl">🏆 You Won!</div>
            <div>You found {targetNumber} in {attempts} attempts!</div>
            <Button onClick={resetGame} className="w-full">
              Play Again
            </Button>
          </div>
        )}

        {gameStatus === 'lost' && (
          <div className="mt-6 space-y-4">
            <div className="text-2xl">😢 Better luck next time!</div>
            <Button onClick={resetGame} className="w-full">
              Play Again
            </Button>
          </div>
        )}

        {guessHistory.length > 0 && gameStatus === 'playing' && (
          <div className="mt-6">
            <div className="text-sm font-bold mb-2">Recent Guesses:</div>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {guessHistory.slice(-3).map((entry, index) => (
                <div key={index} className="text-xs bg-white/10 rounded p-2">
                  <span className="font-bold">{entry.guess}:</span> {entry.feedback.replace(/[🎉🔥📈📉]/g, '')}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NumberGuessing;
