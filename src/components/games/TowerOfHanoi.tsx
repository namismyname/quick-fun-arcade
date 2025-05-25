
import { useState } from 'react';
import { Button } from "@/components/ui/button";

const TowerOfHanoi = () => {
  const [towers, setTowers] = useState<number[][]>([[3, 2, 1], [], []]);
  const [selectedTower, setSelectedTower] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const resetGame = () => {
    setTowers([[3, 2, 1], [], []]);
    setSelectedTower(null);
    setMoves(0);
    setIsWon(false);
  };

  const selectTower = (towerIndex: number) => {
    if (isWon) return;

    if (selectedTower === null) {
      if (towers[towerIndex].length > 0) {
        setSelectedTower(towerIndex);
      }
    } else {
      if (selectedTower === towerIndex) {
        setSelectedTower(null);
      } else {
        const fromTower = towers[selectedTower];
        const toTower = towers[towerIndex];
        
        if (fromTower.length > 0 && (toTower.length === 0 || fromTower[fromTower.length - 1] < toTower[toTower.length - 1])) {
          const newTowers = towers.map(tower => [...tower]);
          const disk = newTowers[selectedTower].pop()!;
          newTowers[towerIndex].push(disk);
          
          setTowers(newTowers);
          setMoves(moves + 1);
          
          if (newTowers[2].length === 3) {
            setIsWon(true);
          }
        }
        setSelectedTower(null);
      }
    }
  };

  const getDiskColor = (size: number) => {
    const colors = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500'];
    return colors[size - 1];
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Tower of Hanoi</h1>
        
        <div className="mb-4 text-xl">
          Moves: {moves} {isWon && "🎉 Solved!"}
        </div>

        <div className="flex justify-center gap-8 mb-6">
          {towers.map((tower, towerIndex) => (
            <div
              key={towerIndex}
              className={`
                w-32 h-40 border-2 border-white/40 rounded-lg cursor-pointer flex flex-col-reverse items-center justify-start p-2
                ${selectedTower === towerIndex ? 'bg-yellow-400/20 border-yellow-400' : 'bg-white/10 hover:bg-white/20'}
              `}
              onClick={() => selectTower(towerIndex)}
            >
              <div className="w-2 h-32 bg-white/40 mb-2"></div>
              {tower.map((disk, diskIndex) => (
                <div
                  key={diskIndex}
                  className={`
                    h-6 rounded mb-1 ${getDiskColor(disk)}
                    ${disk === 1 ? 'w-12' : disk === 2 ? 'w-20' : 'w-28'}
                  `}
                ></div>
              )).reverse()}
              <div className="text-sm mt-2">Tower {towerIndex + 1}</div>
            </div>
          ))}
        </div>

        <div className="text-sm mb-4 text-gray-300">
          Move all disks to the rightmost tower. You can only move one disk at a time, and you cannot place a larger disk on top of a smaller one.
        </div>

        <Button onClick={resetGame} className="w-full">
          Reset
        </Button>
      </div>
    </div>
  );
};

export default TowerOfHanoi;
