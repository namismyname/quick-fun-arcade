
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const TypingSpeedTest = () => {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [wpm, setWPM] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const sampleTexts = [
    "The quick brown fox jumps over the lazy dog near the riverbank.",
    "Programming is the art of telling another human being what one wants the computer to do.",
    "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole filled with the ends of worms and an oozy smell.",
    "Technology is best when it brings people together and makes their lives easier and more productive.",
    "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
    "Life is what happens to you while you're busy making other plans. Time flies when you're having fun.",
    "Education is the most powerful weapon which you can use to change the world and make it a better place.",
    "Success is not final, failure is not fatal, it is the courage to continue that counts in the end."
  ];

  const startTest = () => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setText(randomText);
    setUserInput('');
    setTimeLeft(60);
    setGameRunning(true);
    setGameOver(false);
    setWPM(0);
    setAccuracy(100);
    setCurrentWordIndex(0);
    setStartTime(Date.now());
  };

  const calculateStats = () => {
    if (!startTime) return;

    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
    const wordsTyped = userInput.trim().split(' ').length;
    const currentWPM = Math.round(wordsTyped / timeElapsed);
    setWPM(currentWPM);

    // Calculate accuracy
    const textWords = text.split(' ');
    const userWords = userInput.trim().split(' ');
    let correctChars = 0;
    let totalChars = 0;

    for (let i = 0; i < Math.min(textWords.length, userWords.length); i++) {
      const textWord = textWords[i];
      const userWord = userWords[i] || '';
      
      for (let j = 0; j < Math.max(textWord.length, userWord.length); j++) {
        totalChars++;
        if (textWord[j] === userWord[j]) {
          correctChars++;
        }
      }
    }

    const accuracyPercent = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    setAccuracy(accuracyPercent);
  };

  useEffect(() => {
    if (!gameRunning || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameRunning(false);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameRunning, gameOver]);

  useEffect(() => {
    if (gameRunning && userInput.length > 0) {
      calculateStats();
    }
  }, [userInput, gameRunning]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!gameRunning) return;
    setUserInput(e.target.value);
  };

  const getCharacterClass = (charIndex: number) => {
    if (charIndex >= userInput.length) {
      return charIndex === userInput.length ? 'bg-blue-500 animate-pulse' : 'text-gray-400';
    }
    
    return text[charIndex] === userInput[charIndex] ? 'text-green-500 bg-green-100' : 'text-red-500 bg-red-100';
  };

  const resetTest = () => {
    setGameRunning(false);
    setGameOver(false);
    setText('');
    setUserInput('');
    setTimeLeft(60);
    setWPM(0);
    setAccuracy(100);
    setStartTime(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-6">⌨️ Typing Speed Test</h1>
        
        {!gameRunning && !gameOver && (
          <div className="space-y-6">
            <div className="text-lg">
              Test your typing speed and accuracy!<br/>
              You'll have 60 seconds to type as much as you can.
            </div>
            <Button onClick={startTest} className="text-xl py-4 px-8">
              Start Test 🚀
            </Button>
          </div>
        )}

        {gameRunning && (
          <>
            <div className="mb-6 grid grid-cols-3 gap-4 text-lg">
              <div className="bg-blue-600 rounded-lg p-4">
                <div className="text-sm">Time Left</div>
                <div className="text-3xl font-bold">{timeLeft}s</div>
              </div>
              <div className="bg-green-600 rounded-lg p-4">
                <div className="text-sm">WPM</div>
                <div className="text-3xl font-bold">{wpm}</div>
              </div>
              <div className="bg-purple-600 rounded-lg p-4">
                <div className="text-sm">Accuracy</div>
                <div className="text-3xl font-bold">{accuracy}%</div>
              </div>
            </div>

            <div className="mb-6 p-6 bg-white/20 rounded-lg text-left">
              <div className="text-lg leading-relaxed font-mono">
                {text.split('').map((char, index) => (
                  <span key={index} className={getCharacterClass(index)}>
                    {char}
                  </span>
                ))}
              </div>
            </div>

            <textarea
              value={userInput}
              onChange={handleInputChange}
              placeholder="Start typing here..."
              className="w-full h-32 p-4 text-black rounded-lg text-lg font-mono resize-none"
              autoFocus
            />
          </>
        )}

        {gameOver && (
          <div className="space-y-6">
            <div className="text-3xl font-bold mb-4">⏰ Time's Up!</div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-green-600 rounded-lg p-6">
                <div className="text-sm">Words Per Minute</div>
                <div className="text-4xl font-bold">{wpm}</div>
              </div>
              <div className="bg-blue-600 rounded-lg p-6">
                <div className="text-sm">Accuracy</div>
                <div className="text-4xl font-bold">{accuracy}%</div>
              </div>
            </div>

            <div className="text-lg mb-6">
              {wpm >= 60 && "🏆 Excellent! You're a typing master!"}
              {wpm >= 40 && wpm < 60 && "👍 Great job! You're quite fast!"}
              {wpm >= 25 && wpm < 40 && "👌 Good work! Keep practicing!"}
              {wpm < 25 && "💪 Keep practicing and you'll improve!"}
            </div>

            <div className="space-y-3">
              <Button onClick={startTest} className="w-full text-lg py-3">
                Try Again 🔄
              </Button>
              <Button onClick={resetTest} variant="outline" className="w-full">
                Back to Menu
              </Button>
            </div>
          </div>
        )}

        {(gameRunning || gameOver) && (
          <div className="mt-6 text-sm text-gray-300">
            Progress: {Math.min(userInput.length, text.length)} / {text.length} characters
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingSpeedTest;
