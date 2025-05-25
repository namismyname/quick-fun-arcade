
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const TypingSpeedTest = () => {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [gameRunning, setGameRunning] = useState(false);

  const sampleTexts = [
    "The quick brown fox jumps over the lazy dog.",
    "Programming is the art of thinking up the specifications of a program.",
    "TypeScript is a programming language developed by Microsoft.",
    "React is a JavaScript library for building user interfaces."
  ];

  const startTest = () => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setText(randomText);
    setUserInput('');
    setStartTime(Date.now());
    setGameRunning(true);
    setWpm(0);
    setAccuracy(100);
  };

  useEffect(() => {
    if (!gameRunning || !startTime) return;

    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // minutes
    const wordsTyped = userInput.trim().split(' ').length;
    const currentWpm = Math.round(wordsTyped / timeElapsed) || 0;
    
    let correctChars = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === text[i]) correctChars++;
    }
    const currentAccuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100;

    setWpm(currentWpm);
    setAccuracy(currentAccuracy);

    if (userInput === text) {
      setGameRunning(false);
    }
  }, [userInput, startTime, gameRunning, text]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-500 to-blue-600 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-6">Typing Speed Test</h1>
        
        <div className="mb-4 grid grid-cols-2 gap-4 text-xl">
          <div>WPM: {wpm}</div>
          <div>Accuracy: {accuracy}%</div>
        </div>

        {gameRunning && (
          <div className="mb-6">
            <div className="bg-white/20 p-4 rounded-lg mb-4 text-left">
              <div className="font-mono text-lg leading-relaxed">
                {text.split('').map((char, index) => (
                  <span
                    key={index}
                    className={
                      index < userInput.length
                        ? userInput[index] === char
                          ? 'bg-green-500'
                          : 'bg-red-500'
                        : index === userInput.length
                        ? 'bg-yellow-400 text-black'
                        : ''
                    }
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full h-32 p-4 rounded-lg text-black font-mono"
              placeholder="Start typing here..."
              autoFocus
            />
          </div>
        )}

        {!gameRunning && userInput === text && text && (
          <div className="mb-6 text-2xl">
            🎉 Test Complete! WPM: {wpm}, Accuracy: {accuracy}%
          </div>
        )}

        <Button onClick={startTest} className="w-full">
          {gameRunning ? 'Restart Test' : 'Start Test'}
        </Button>
      </div>
    </div>
  );
};

export default TypingSpeedTest;
