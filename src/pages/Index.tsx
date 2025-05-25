
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import GameMenu from '../components/GameMenu';
import TicTacToe from '../components/games/TicTacToe';
import Snake from '../components/games/Snake';
import MemoryMatch from '../components/games/MemoryMatch';
import RockPaperScissors from '../components/games/RockPaperScissors';
import Breakout from '../components/games/Breakout';
import Tetris from '../components/games/Tetris';
import ConnectFour from '../components/games/ConnectFour';
import WhackAMole from '../components/games/WhackAMole';
import Game2048 from '../components/games/2048';
import Pong from '../components/games/Pong';
import CoinFlip from '../components/games/CoinFlip';
import DiceRoller from '../components/games/DiceRoller';
import Hangman from '../components/games/Hangman';
import Sudoku from '../components/games/Sudoku';
import SlidingPuzzle from '../components/games/SlidingPuzzle';
import FlappyBird from '../components/games/FlappyBird';
import ClickTarget from '../components/games/ClickTarget';
import BalloonPop from '../components/games/BalloonPop';
import Asteroids from '../components/games/Asteroids';
import DinoGame from '../components/games/DinoGame';

const Index = () => {
  const [currentGame, setCurrentGame] = useState<string | null>(null);

  const renderGame = () => {
    switch (currentGame) {
      case 'tic-tac-toe':
        return <TicTacToe />;
      case 'snake':
        return <Snake />;
      case 'memory-match':
        return <MemoryMatch />;
      case 'rock-paper-scissors':
        return <RockPaperScissors />;
      case 'breakout':
        return <Breakout />;
      case 'tetris':
        return <Tetris />;
      case 'connect-four':
        return <ConnectFour />;
      case 'whack-a-mole':
        return <WhackAMole />;
      case '2048':
        return <Game2048 />;
      case 'pong':
        return <Pong />;
      case 'coin-flip':
        return <CoinFlip />;
      case 'dice-roller':
        return <DiceRoller />;
      case 'hangman':
        return <Hangman />;
      case 'sudoku':
        return <Sudoku />;
      case 'sliding-puzzle':
        return <SlidingPuzzle />;
      case 'flappy-bird':
        return <FlappyBird />;
      case 'click-target':
        return <ClickTarget />;
      case 'balloon-pop':
        return <BalloonPop />;
      case 'asteroids':
        return <Asteroids />;
      case 'dino-game':
        return <DinoGame />;
      // Coming soon games - show placeholder
      case 'minesweeper':
      case 'word-search':
      case 'tower-of-hanoi':
      case 'space-invaders':
      case 'avoid-falling-objects':
      case 'slot-machine':
      case 'number-guessing':
      case 'color-match':
      case 'typing-speed-test':
      case 'music-memory':
      case 'helix-jump':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-600 to-gray-800 text-white p-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <h1 className="text-4xl font-bold mb-6">🚧 Coming Soon!</h1>
              <p className="text-xl mb-4">This game is being developed</p>
              <p className="text-gray-300">Check back later for updates!</p>
            </div>
          </div>
        );
      default:
        return <GameMenu onSelectGame={setCurrentGame} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {currentGame && (
          <div className="mb-6">
            <Button
              onClick={() => setCurrentGame(null)}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Button>
          </div>
        )}
        {renderGame()}
      </div>
    </div>
  );
};

export default Index;
