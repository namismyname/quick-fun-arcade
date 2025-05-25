
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const SimonSays = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isShowing, setIsShowing] = useState(false);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);

  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'];

  const startGame = () => {
    const newSequence = [Math.floor(Math.random() * 4)];
    setSequence(newSequence);
    setUserSequence([]);
    setGameStarted(true);
    setScore(0);
    showSequence(newSequence);
  };

  const showSequence = (seq: number[]) => {
    setIsShowing(true);
    seq.forEach((color, index) => {
      setTimeout(() => {
        setActiveButton(color);
        setTimeout(() => setActiveButton(null), 500);
      }, index * 600);
    });
    setTimeout(() => setIsShowing(false), seq.length * 600);
  };

  const handleButtonClick = (buttonIndex: number) => {
    if (isShowing) return;

    const newUserSequence = [...userSequence, buttonIndex];
    setUserSequence(newUserSequence);

    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      setGameStarted(false);
      return;
    }

    if (newUserSequence.length === sequence.length) {
      const newSequence = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(newSequence);
      setUserSequence([]);
      setScore(prev => prev + 1);
      setTimeout(() => showSequence(newSequence), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Simon Says</h1>
        
        <div className="mb-4 text-xl">Score: {score}</div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {colors.map((color, index) => (
            <button
              key={index}
              className={`w-24 h-24 rounded-lg border-4 border-white transition-all hover:scale-110 ${
                activeButton === index ? 'brightness-150' : ''
              } ${color}`}
              onClick={() => handleButtonClick(index)}
              disabled={isShowing}
            />
          ))}
        </div>

        {!gameStarted && score > 0 && (
          <div className="mb-4 text-xl">
            Game Over! Final Score: {score}
          </div>
        )}

        <div className="mb-4 text-sm">
          {isShowing ? 'Watch the sequence...' : 'Repeat the sequence!'}
        </div>

        <Button onClick={startGame} className="w-full">
          {gameStarted ? 'Restart' : 'Start Game'}
        </Button>
      </div>
    </div>
  );
};

export default SimonSays;
