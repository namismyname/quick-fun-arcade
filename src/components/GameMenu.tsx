
import { Button } from "@/components/ui/button";

interface GameMenuProps {
  onSelectGame: (gameId: string) => void;
}

const GameMenu = ({ onSelectGame }: GameMenuProps) => {
  const puzzleGames = [
    { id: 'hangman', name: 'Hangman', difficulty: 'Easy', description: 'Guess the word letter by letter' },
    { id: 'sudoku', name: 'Sudoku', difficulty: 'Hard', description: 'Fill the 9x9 grid with numbers' },
    { id: 'sliding-puzzle', name: 'Sliding Puzzle', difficulty: 'Medium', description: 'Slide tiles to complete the puzzle' },
  ];

  const arcadeGames = [
    { id: 'flappy-bird', name: 'Flappy Bird', difficulty: 'Hard', description: 'Navigate through pipes' },
    { id: 'asteroids', name: 'Asteroids', difficulty: 'Hard', description: 'Destroy asteroids in space' },
    { id: 'click-target', name: 'Click Target', difficulty: 'Medium', description: 'Click targets for points' },
  ];

  const casualGames = [
    { id: 'balloon-pop', name: 'Balloon Pop', difficulty: 'Easy', description: 'Pop balloons for points' },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const renderGameSection = (title: string, games: any[], bgClass: string) => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => (
          <Button
            key={game.id}
            onClick={() => onSelectGame(game.id)}
            className={`${bgClass} h-auto p-6 flex flex-col items-center text-center hover:scale-105 transition-transform`}
            variant="outline"
          >
            <div className="text-xl font-bold mb-2">{game.name}</div>
            <div className={`text-sm ${getDifficultyColor(game.difficulty)} mb-2`}>
              {game.difficulty}
            </div>
            <div className="text-sm text-gray-300">
              {game.description}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="text-center">
      <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
        🎮 Game Hub
      </h1>
      <p className="text-xl text-gray-300 mb-12">Choose your adventure!</p>
      
      {renderGameSection("🧠 Puzzle Games", puzzleGames, "bg-blue-600/20 border-blue-400/40")}
      {renderGameSection("🕹️ Arcade Games", arcadeGames, "bg-red-600/20 border-red-400/40")}
      {renderGameSection("🎲 Casual Games", casualGames, "bg-green-600/20 border-green-400/40")}
    </div>
  );
};

export default GameMenu;
