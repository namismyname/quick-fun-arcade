
import { useState } from 'react';
import { Button } from "@/components/ui/button";

const CoinFlip = () => {
  const [coin, setCoin] = useState<'heads' | 'tails' | null>(null);
  const [guess, setGuess] = useState<'heads' | 'tails' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [score, setScore] = useState({correct: 0, total: 0});
  const [result, setResult] = useState<string | null>(null);

  const flipCoin = () => {
    if (!guess) return;
    
    setIsFlipping(true);
    setResult(null);
    
    setTimeout(() => {
      const result = Math.random() < 0.5 ? 'heads' : 'tails';
      setCoin(result);
      setIsFlipping(false);
      
      const isCorrect = guess === result;
      setScore(prev => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1
      }));
      
      setResult(isCorrect ? 'Correct!' : 'Wrong!');
      setGuess(null);
    }, 1000);
  };

  const resetScore = () => {
    setScore({correct: 0, total: 0});
    setCoin(null);
    setGuess(null);
    setResult(null);
  };

  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-400 to-amber-600 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Coin Flip</h1>
        
        <div className="mb-6 grid grid-cols-3 gap-4 text-lg">
          <div>Correct: {score.correct}</div>
          <div>Total: {score.total}</div>
          <div>Accuracy: {accuracy}%</div>
        </div>

        <div className="mb-6">
          <div className={`w-32 h-32 mx-auto rounded-full border-4 border-white flex items-center justify-center text-4xl font-bold transition-transform duration-1000 ${isFlipping ? 'animate-spin' : ''} ${coin === 'heads' ? 'bg-yellow-500' : 'bg-gray-500'}`}>
            {isFlipping ? '?' : coin === 'heads' ? '👑' : '🏛️'}
          </div>
        </div>

        {result && (
          <div className={`mb-4 text-2xl font-bold ${result === 'Correct!' ? 'text-green-400' : 'text-red-400'}`}>
            {result}
          </div>
        )}

        <div className="mb-6">
          <p className="mb-4">Make your guess:</p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => setGuess('heads')}
              className={`h-16 text-lg ${guess === 'heads' ? 'bg-blue-600' : 'bg-white/20'}`}
              variant="outline"
            >
              👑 Heads
            </Button>
            <Button
              onClick={() => setGuess('tails')}
              className={`h-16 text-lg ${guess === 'tails' ? 'bg-blue-600' : 'bg-white/20'}`}
              variant="outline"
            >
              🏛️ Tails
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={flipCoin} 
            disabled={!guess || isFlipping}
            className="w-full"
          >
            {isFlipping ? 'Flipping...' : 'Flip Coin!'}
          </Button>
          <Button onClick={resetScore} variant="outline" className="w-full">
            Reset Score
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoinFlip;
