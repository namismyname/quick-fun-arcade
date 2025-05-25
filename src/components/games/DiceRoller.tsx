
import { useState } from 'react';
import { Button } from "@/components/ui/button";

const DiceRoller = () => {
  const [dice, setDice] = useState([1, 1]);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const [stats, setStats] = useState({
    rolls: 0,
    total: 0,
    doubles: 0
  });

  const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  const rollDice = () => {
    setIsRolling(true);
    
    // Animate rolling
    const rollAnimation = setInterval(() => {
      setDice([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(rollAnimation);
      const newDice = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ];
      
      setDice(newDice);
      setIsRolling(false);
      
      const sum = newDice[0] + newDice[1];
      setHistory(prev => [sum, ...prev.slice(0, 9)]);
      
      setStats(prev => ({
        rolls: prev.rolls + 1,
        total: prev.total + sum,
        doubles: prev.doubles + (newDice[0] === newDice[1] ? 1 : 0)
      }));
    }, 1000);
  };

  const resetStats = () => {
    setHistory([]);
    setStats({rolls: 0, total: 0, doubles: 0});
    setDice([1, 1]);
  };

  const average = stats.rolls > 0 ? (stats.total / stats.rolls).toFixed(1) : '0.0';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-500 to-purple-600 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Dice Roller</h1>
        
        <div className="mb-6 grid grid-cols-2 gap-8">
          <div className={`text-8xl transition-transform duration-300 ${isRolling ? 'animate-bounce' : ''}`}>
            {diceEmojis[dice[0] - 1]}
          </div>
          <div className={`text-8xl transition-transform duration-300 ${isRolling ? 'animate-bounce' : ''}`}>
            {diceEmojis[dice[1] - 1]}
          </div>
        </div>

        <div className="mb-6 text-3xl font-bold">
          Total: {dice[0] + dice[1]}
          {dice[0] === dice[1] && <span className="text-yellow-400 ml-2">🎲 DOUBLES!</span>}
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 text-lg">
          <div>
            <div className="text-sm text-gray-300">Rolls</div>
            <div className="font-bold">{stats.rolls}</div>
          </div>
          <div>
            <div className="text-sm text-gray-300">Average</div>
            <div className="font-bold">{average}</div>
          </div>
          <div>
            <div className="text-sm text-gray-300">Doubles</div>
            <div className="font-bold">{stats.doubles}</div>
          </div>
          <div>
            <div className="text-sm text-gray-300">Total Sum</div>
            <div className="font-bold">{stats.total}</div>
          </div>
        </div>

        {history.length > 0 && (
          <div className="mb-6">
            <div className="text-sm text-gray-300 mb-2">Recent Rolls</div>
            <div className="flex justify-center gap-2 flex-wrap">
              {history.map((roll, index) => (
                <div key={index} className="bg-white/20 rounded px-2 py-1 text-sm">
                  {roll}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={rollDice} 
            disabled={isRolling}
            className="w-full h-12 text-lg"
          >
            {isRolling ? 'Rolling...' : 'Roll Dice!'}
          </Button>
          <Button onClick={resetStats} variant="outline" className="w-full h-12">
            Reset Stats
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiceRoller;
