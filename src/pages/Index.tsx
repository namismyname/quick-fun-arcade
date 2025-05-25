
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import GameMenu from '../components/GameMenu';
import Hangman from '../components/games/Hangman';
import Sudoku from '../components/games/Sudoku';
import SlidingPuzzle from '../components/games/SlidingPuzzle';
import FlappyBird from '../components/games/FlappyBird';
import ClickTarget from '../components/games/ClickTarget';
import BalloonPop from '../components/games/BalloonPop';
import Asteroids from '../components/games/Asteroids';

const Index = () => {
  const [currentGame, setCurrentGame] = useState<string | null>(null);

  const renderGame = () => {
    switch (currentGame) {
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
