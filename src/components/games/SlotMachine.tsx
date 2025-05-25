
import { useState } from 'react';
import { Button } from "@/components/ui/button";

const SlotMachine = () => {
  const [reels, setReels] = useState(['🍒', '🍒', '🍒']);
  const [spinning, setSpinning] = useState(false);
  const [credits, setCredits] = useState(100);
  const [lastWin, setLastWin] = useState(0);
  const [totalWins, setTotalWins] = useState(0);

  const symbols = ['🍒', '🍋', '🍊', '🍇', '🔔', '⭐', '💎', '7️⃣'];
  const payouts = {
    '🍒🍒🍒': 10,
    '🍋🍋🍋': 20,
    '🍊🍊🍊': 30,
    '🍇🍇🍇': 40,
    '🔔🔔🔔': 50,
    '⭐⭐⭐': 100,
    '💎💎💎': 200,
    '7️⃣7️⃣7️⃣': 500,
    '🍒🍒': 2,
    '🍋🍋': 2,
    '🍊🍊': 2,
    '🍇🍇': 2,
  };

  const spin = () => {
    if (spinning || credits < 1) return;
    
    setCredits(prev => prev - 1);
    setSpinning(true);
    setLastWin(0);

    // Simulate spinning animation
    const spinDuration = 2000;
    const spinInterval = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      
      // Final result
      const finalReels = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ];
      
      setReels(finalReels);
      setSpinning(false);

      // Check for wins
      const combination = finalReels.join('');
      let winAmount = 0;

      // Check for exact matches
      if (payouts[combination]) {
        winAmount = payouts[combination];
      } else {
        // Check for two matching symbols
        const twoMatch = finalReels[0] + finalReels[1];
        if (finalReels[0] === finalReels[1] && payouts[twoMatch]) {
          winAmount = payouts[twoMatch];
        } else {
          const twoMatch2 = finalReels[1] + finalReels[2];
          if (finalReels[1] === finalReels[2] && payouts[twoMatch2]) {
            winAmount = payouts[twoMatch2];
          }
        }
      }

      if (winAmount > 0) {
        setCredits(prev => prev + winAmount);
        setLastWin(winAmount);
        setTotalWins(prev => prev + winAmount);
      }
    }, spinDuration);
  };

  const resetGame = () => {
    setCredits(100);
    setLastWin(0);
    setTotalWins(0);
    setReels(['🍒', '🍒', '🍒']);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-800 to-red-700 text-white p-4">
      <div className="bg-yellow-600 border-8 border-yellow-400 rounded-2xl p-8 text-center max-w-md w-full shadow-2xl">
        <h1 className="text-4xl font-bold mb-6 text-yellow-100">🎰 Slot Machine</h1>
        
        <div className="bg-black rounded-lg p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {reels.map((symbol, index) => (
              <div
                key={index}
                className={`
                  w-20 h-20 bg-white rounded-lg flex items-center justify-center text-4xl border-4 border-gray-300
                  ${spinning ? 'animate-pulse' : ''}
                `}
              >
                {symbol}
              </div>
            ))}
          </div>
          
          {lastWin > 0 && (
            <div className="text-2xl font-bold text-yellow-400 animate-pulse">
              🎉 YOU WIN {lastWin} CREDITS! 🎉
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-lg">
          <div className="bg-green-600 rounded-lg p-3">
            <div className="text-sm">Credits</div>
            <div className="text-2xl font-bold">{credits}</div>
          </div>
          <div className="bg-blue-600 rounded-lg p-3">
            <div className="text-sm">Total Wins</div>
            <div className="text-2xl font-bold">{totalWins}</div>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={spin} 
            disabled={spinning || credits < 1}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 text-xl"
          >
            {spinning ? '🎰 SPINNING...' : 'SPIN (1 credit)'}
          </Button>
          
          <Button 
            onClick={resetGame} 
            variant="outline"
            className="w-full"
          >
            Reset Game
          </Button>
        </div>

        <div className="mt-6 text-xs text-yellow-200">
          <div className="font-bold mb-2">PAYOUTS:</div>
          <div className="grid grid-cols-2 gap-1 text-left">
            <div>🍒🍒🍒 = 10</div>
            <div>⭐⭐⭐ = 100</div>
            <div>🍋🍋🍋 = 20</div>
            <div>💎💎💎 = 200</div>
            <div>🍊🍊🍊 = 30</div>
            <div>7️⃣7️⃣7️⃣ = 500</div>
            <div>🍇🍇🍇 = 40</div>
            <div>Two match = 2</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;
