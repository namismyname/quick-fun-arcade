
import { useState } from 'react';
import { Button } from "@/components/ui/button";

const RockPaperScissors = () => {
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [computerChoice, setComputerChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState({player: 0, computer: 0});

  const choices = [
    {name: 'rock', emoji: '🪨', beats: 'scissors'},
    {name: 'paper', emoji: '📄', beats: 'rock'},
    {name: 'scissors', emoji: '✂️', beats: 'paper'}
  ];

  const playGame = (playerChoice: string) => {
    const computerChoice = choices[Math.floor(Math.random() * choices.length)].name;
    setPlayerChoice(playerChoice);
    setComputerChoice(computerChoice);

    if (playerChoice === computerChoice) {
      setResult('Tie!');
    } else if (choices.find(c => c.name === playerChoice)?.beats === computerChoice) {
      setResult('You win!');
      setScore(prev => ({...prev, player: prev.player + 1}));
    } else {
      setResult('Computer wins!');
      setScore(prev => ({...prev, computer: prev.computer + 1}));
    }
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setScore({player: 0, computer: 0});
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-500 to-red-600 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Rock Paper Scissors</h1>
        
        <div className="mb-6 text-xl">
          Score: You {score.player} - {score.computer} Computer
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {choices.map(choice => (
            <Button
              key={choice.name}
              onClick={() => playGame(choice.name)}
              className="h-24 w-24 text-4xl bg-white/20 hover:bg-white/30"
              variant="outline"
            >
              {choice.emoji}
            </Button>
          ))}
        </div>

        {result && (
          <div className="mb-6">
            <div className="flex justify-center items-center gap-8 mb-4">
              <div className="text-center">
                <div className="text-sm">You</div>
                <div className="text-6xl">
                  {choices.find(c => c.name === playerChoice)?.emoji}
                </div>
              </div>
              <div className="text-2xl">VS</div>
              <div className="text-center">
                <div className="text-sm">Computer</div>
                <div className="text-6xl">
                  {choices.find(c => c.name === computerChoice)?.emoji}
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold">{result}</div>
          </div>
        )}

        <Button onClick={resetGame} className="w-full">
          Reset Score
        </Button>
      </div>
    </div>
  );
};

export default RockPaperScissors;
