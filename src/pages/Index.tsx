
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
import Minesweeper from '../components/games/Minesweeper';
import SlidingPuzzle from '../components/games/SlidingPuzzle';
import WordSearch from '../components/games/WordSearch';
import TowerOfHanoi from '../components/games/TowerOfHanoi';
import FlappyBird from '../components/games/FlappyBird';
import Asteroids from '../components/games/Asteroids';
import SpaceInvaders from '../components/games/SpaceInvaders';
import DinoGame from '../components/games/DinoGame';
import AvoidFallingObjects from '../components/games/AvoidFallingObjects';
import ClickTarget from '../components/games/ClickTarget';
import SlotMachine from '../components/games/SlotMachine';
import BalloonPop from '../components/games/BalloonPop';
import NumberGuessing from '../components/games/NumberGuessing';
import ColorMatch from '../components/games/ColorMatch';
import TypingSpeedTest from '../components/games/TypingSpeedTest';
import MusicMemory from '../components/games/MusicMemory';
import HelixJump from '../components/games/HelixJump';

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
      case 'minesweeper':
        return <Minesweeper />;
      case 'sliding-puzzle':
        return <SlidingPuzzle />;
      case 'word-search':
        return <WordSearch />;
      case 'tower-of-hanoi':
        return <TowerOfHanoi />;
      case 'flappy-bird':
        return <FlappyBird />;
      case 'asteroids':
        return <Asteroids />;
      case 'space-invaders':
        return <SpaceInvaders />;
      case 'dino-game':
        return <DinoGame />;
      case 'avoid-falling-objects':
        return <AvoidFallingObjects />;
      case 'click-target':
        return <ClickTarget />;
      case 'slot-machine':
        return <SlotMachine />;
      case 'balloon-pop':
        return <BalloonPop />;
      case 'number-guessing':
        return <NumberGuessing />;
      case 'color-match':
        return <ColorMatch />;
      case 'typing-speed-test':
        return <TypingSpeedTest />;
      case 'music-memory':
        return <MusicMemory />;
      case 'helix-jump':
        return <HelixJump />;
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
