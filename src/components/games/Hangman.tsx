
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const words = ['REACT', 'JAVASCRIPT', 'COMPUTER', 'PROGRAMMING', 'DEVELOPER', 'WEBSITE', 'CODING', 'SOFTWARE'];

const Hangman = () => {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const maxWrongGuesses = 6;

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setWord(randomWord);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameStatus('playing');
  };

  const guessLetter = (letter: string) => {
    if (guessedLetters.includes(letter) || gameStatus !== 'playing') return;

    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);

    if (!word.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      if (newWrongGuesses >= maxWrongGuesses) {
        setGameStatus('lost');
      }
    } else {
      const wordLetters = word.split('');
      const allLettersGuessed = wordLetters.every(l => newGuessedLetters.includes(l));
      if (allLettersGuessed) {
        setGameStatus('won');
      }
    }
  };

  const displayWord = () => {
    return word.split('').map(letter => 
      guessedLetters.includes(letter) ? letter : '_'
    ).join(' ');
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-400 to-red-600 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center max-w-md w-full">
        <h1 className="text-4xl font-bold mb-6">Hangman</h1>
        
        <div className="mb-6">
          <div className="text-6xl mb-4">🎭</div>
          <div className="text-2xl font-mono mb-4">{displayWord()}</div>
          <div className="text-lg">Wrong guesses: {wrongGuesses}/{maxWrongGuesses}</div>
        </div>

        {gameStatus === 'playing' && (
          <div className="grid grid-cols-6 gap-2 mb-6">
            {alphabet.map(letter => (
              <Button
                key={letter}
                onClick={() => guessLetter(letter)}
                disabled={guessedLetters.includes(letter)}
                className="w-10 h-10 text-sm"
                variant={guessedLetters.includes(letter) ? "secondary" : "default"}
              >
                {letter}
              </Button>
            ))}
          </div>
        )}

        {gameStatus === 'won' && (
          <div className="mb-6">
            <div className="text-2xl text-green-300 mb-2">🎉 You Won!</div>
            <div>The word was: {word}</div>
          </div>
        )}

        {gameStatus === 'lost' && (
          <div className="mb-6">
            <div className="text-2xl text-red-300 mb-2">💀 Game Over</div>
            <div>The word was: {word}</div>
          </div>
        )}

        <Button onClick={resetGame} className="w-full">
          New Game
        </Button>
      </div>
    </div>
  );
};

export default Hangman;
