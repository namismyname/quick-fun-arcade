
import { useState } from 'react';
import { Button } from "@/components/ui/button";

const MusicMemory = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);

  const notes = ['🎵', '🎶', '🎼', '🎤'];

  const startGame = () => {
    setSequence([Math.floor(Math.random() * 4)]);
    setUserSequence([]);
    setGameStarted(true);
    setScore(0);
    playSequence([Math.floor(Math.random() * 4)]);
  };

  const playSequence = (seq: number[]) => {
    setIsPlaying(true);
    // Simulate playing sequence
    setTimeout(() => setIsPlaying(false), seq.length * 600);
  };

  const addNote = (noteIndex: number) => {
    if (isPlaying) return;
    
    const newUserSequence = [...userSequence, noteIndex];
    setUserSequence(newUserSequence);

    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      // Wrong note
      setGameStarted(false);
      return;
    }

    if (newUserSequence.length === sequence.length) {
      // Correct sequence completed
      const newSequence = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(newSequence);
      setUserSequence([]);
      setScore(prev => prev + 1);
      setTimeout(() => playSequence(newSequence), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Music Memory</h1>
        
        <div className="mb-4 text-xl">Score: {score}</div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {notes.map((note, index) => (
            <button
              key={index}
              className={`w-24 h-24 text-4xl rounded-lg border-4 border-white transition-all hover:scale-110 ${
                isPlaying && sequence[userSequence.length] === index ? 'bg-yellow-400' : 'bg-white/20'
              }`}
              onClick={() => addNote(index)}
              disabled={isPlaying}
            >
              {note}
            </button>
          ))}
        </div>

        {!gameStarted && score > 0 && (
          <div className="mb-4 text-xl">
            Game Over! Final Score: {score}
          </div>
        )}

        <Button onClick={startGame} className="w-full">
          {gameStarted ? 'Restart' : 'Start Game'}
        </Button>
      </div>
    </div>
  );
};

export default MusicMemory;
