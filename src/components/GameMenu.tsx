
import { Button } from "@/components/ui/button";

interface GameMenuProps {
  onSelectGame: (gameId: string) => void;
}

const GameMenu = ({ onSelectGame }: GameMenuProps) => {
  const puzzleGames = [
    { id: 'tic-tac-toe', name: 'Tic Tac Toe', difficulty: 'Easy', description: 'Classic 3x3 grid game' },
    { id: '2048', name: '2048', difficulty: 'Medium', description: 'Combine tiles to reach 2048' },
    { id: 'sudoku', name: 'Sudoku', difficulty: 'Hard', description: 'Fill the 9x9 grid with numbers' },
    { id: 'minesweeper', name: 'Minesweeper', difficulty: 'Medium', description: 'Find mines without exploding' },
    { id: 'memory-match', name: 'Memory Match', difficulty: 'Easy', description: 'Match pairs of cards' },
    { id: 'sliding-puzzle', name: 'Sliding Puzzle', difficulty: 'Medium', description: 'Slide tiles to complete image' },
    { id: 'hangman', name: 'Hangman', difficulty: 'Easy', description: 'Guess the word letter by letter' },
    { id: 'word-search', name: 'Word Search', difficulty: 'Easy', description: 'Find hidden words in grid' },
    { id: 'connect-four', name: 'Connect Four', difficulty: 'Medium', description: 'Connect 4 pieces in a row' },
    { id: 'tower-of-hanoi', name: 'Tower of Hanoi', difficulty: 'Hard', description: 'Move disks to solve puzzle' },
  ];

  const arcadeGames = [
    { id: 'snake', name: 'Snake', difficulty: 'Medium', description: 'Eat food and grow longer' },
    { id: 'pong', name: 'Pong', difficulty: 'Easy', description: 'Classic paddle ball game' },
    { id: 'flappy-bird', name: 'Flappy Bird', difficulty: 'Hard', description: 'Navigate through pipes' },
    { id: 'breakout', name: 'Breakout', difficulty: 'Medium', description: 'Break bricks with ball' },
    { id: 'tetris', name: 'Tetris', difficulty: 'Hard', description: 'Stack falling blocks' },
    { id: 'asteroids', name: 'Asteroids', difficulty: 'Hard', description: 'Destroy asteroids in space' },
    { id: 'space-invaders', name: 'Space Invaders', difficulty: 'Medium', description: 'Defend against alien invasion' },
    { id: 'dino-game', name: 'Dino Game', difficulty: 'Medium', description: 'Jump over obstacles' },
    { id: 'click-target', name: 'Click Target', difficulty: 'Easy', description: 'Click targets for points' },
    { id: 'avoid-falling-objects', name: 'Avoid Objects', difficulty: 'Medium', description: 'Dodge falling objects' },
    { id: 'helix-jump', name: 'Helix Jump', difficulty: 'Medium', description: 'Navigate through helix tower' },
  ];

  const casualGames = [
    { id: 'rock-paper-scissors', name: 'Rock Paper Scissors', difficulty: 'Easy', description: 'Classic hand game' },
    { id: 'whack-a-mole', name: 'Whack-a-Mole', difficulty: 'Easy', description: 'Hit moles as they appear' },
    { id: 'coin-flip', name: 'Coin Flip', difficulty: 'Easy', description: 'Heads or tails guessing' },
    { id: 'dice-roller', name: 'Dice Roller', difficulty: 'Easy', description: 'Roll dice and track stats' },
    { id: 'slot-machine', name: 'Slot Machine', difficulty: 'Easy', description: 'Spin to win jackpot' },
    { id: 'balloon-pop', name: 'Balloon Pop', difficulty: 'Easy', description: 'Pop balloons for points' },
    { id: 'number-guessing', name: 'Number Guessing', difficulty: 'Easy', description: 'Guess the secret number' },
    { id: 'color-match', name: 'Color Match', difficulty: 'Medium', description: 'Match colors quickly' },
    { id: 'typing-speed-test', name: 'Typing Test', difficulty: 'Medium', description: 'Test your typing speed' },
    { id: 'music-memory', name: 'Music Memory', difficulty: 'Hard', description: 'Remember musical sequences' },
    { id: 'simon-says', name: 'Simon Says', difficulty: 'Medium', description: 'Follow the pattern sequence' },
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {games.map((game) => (
          <Button
            key={game.id}
            onClick={() => onSelectGame(game.id)}
            className={`${bgClass} h-auto p-4 flex flex-col items-center text-center hover:scale-105 transition-transform`}
            variant="outline"
          >
            <div className="text-lg font-bold mb-1">{game.name}</div>
            <div className={`text-xs ${getDifficultyColor(game.difficulty)} mb-1`}>
              {game.difficulty}
            </div>
            <div className="text-xs text-gray-300">
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
      <p className="text-xl text-gray-300 mb-8">Choose from 32 amazing games!</p>
      
      {renderGameSection("🧠 Puzzle & Logic Games (10)", puzzleGames, "bg-blue-600/20 border-blue-400/40")}
      {renderGameSection("🕹️ Arcade & Action Games (11)", arcadeGames, "bg-red-600/20 border-red-400/40")}
      {renderGameSection("🎲 Casual & Fun Games (11)", casualGames, "bg-green-600/20 border-green-400/40")}
    </div>
  );
};

export default GameMenu;
