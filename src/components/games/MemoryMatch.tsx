
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface Card {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
}

const MemoryMatch = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const cardValues = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

  const initializeGame = () => {
    const gameCards = [...cardValues, ...cardValues]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        flipped: false,
        matched: false
      }));
    
    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setGameWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      setMoves(m => m + 1);
      
      if (cards[first].value === cards[second].value) {
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? {...card, matched: true, flipped: false}
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? {...card, flipped: false}
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.matched)) {
      setGameWon(true);
    }
  }, [cards]);

  const flipCard = (id: number) => {
    if (flippedCards.length === 2 || cards[id].flipped || cards[id].matched) return;
    
    setCards(prev => prev.map(card => 
      card.id === id ? {...card, flipped: true} : card
    ));
    setFlippedCards(prev => [...prev, id]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Memory Match</h1>
        
        <div className="mb-4 text-xl">
          Moves: {moves} {gameWon && "🎉 You Won!"}
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6 max-w-md">
          {cards.map(card => (
            <div
              key={card.id}
              className={`
                w-16 h-16 rounded-lg cursor-pointer flex items-center justify-center text-2xl font-bold
                ${card.flipped || card.matched ? 'bg-white text-gray-800' : 'bg-white/20 hover:bg-white/30'}
                transition-all duration-300
              `}
              onClick={() => flipCard(card.id)}
            >
              {card.flipped || card.matched ? card.value : '?'}
            </div>
          ))}
        </div>

        <Button onClick={initializeGame} className="w-full">
          New Game
        </Button>
      </div>
    </div>
  );
};

export default MemoryMatch;
