
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface Note {
  id: number;
  color: string;
  sound: string;
  name: string;
}

const MusicMemory = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [gameStatus, setGameStatus] = useState<'start' | 'showing' | 'playing' | 'correct' | 'wrong'>('start');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [showingIndex, setShowingIndex] = useState(0);
  const [playingNote, setPlayingNote] = useState<number | null>(null);

  const notes: Note[] = [
    { id: 0, color: 'bg-red-500', sound: 'C', name: 'Do' },
    { id: 1, color: 'bg-orange-500', sound: 'D', name: 'Re' },
    { id: 2, color: 'bg-yellow-500', sound: 'E', name: 'Mi' },
    { id: 3, color: 'bg-green-500', sound: 'F', name: 'Fa' },
    { id: 4, color: 'bg-blue-500', sound: 'G', name: 'Sol' },
    { id: 5, color: 'bg-indigo-500', sound: 'A', name: 'La' },
    { id: 6, color: 'bg-purple-500', sound: 'B', name: 'Ti' },
    { id: 7, color: 'bg-pink-500', sound: 'C2', name: 'Do²' }
  ];

  const startGame = () => {
    setLevel(1);
    setScore(0);
    generateSequence(1);
  };

  const generateSequence = (sequenceLength: number) => {
    const newSequence: number[] = [];
    for (let i = 0; i < sequenceLength; i++) {
      newSequence.push(Math.floor(Math.random() * notes.length));
    }
    setSequence(newSequence);
    setPlayerSequence([]);
    setGameStatus('showing');
    setShowingIndex(0);
    showSequence(newSequence);
  };

  const showSequence = (sequenceToShow: number[]) => {
    let index = 0;
    const showNext = () => {
      if (index < sequenceToShow.length) {
        setPlayingNote(sequenceToShow[index]);
        setShowingIndex(index);
        
        // Simulate sound playing
        console.log(`Playing note: ${notes[sequenceToShow[index]].sound}`);
        
        setTimeout(() => {
          setPlayingNote(null);
          setTimeout(() => {
            index++;
            if (index < sequenceToShow.length) {
              showNext();
            } else {
              setGameStatus('playing');
            }
          }, 200);
        }, 600);
      }
    };
    showNext();
  };

  const handleNoteClick = (noteId: number) => {
    if (gameStatus !== 'playing') return;

    // Visual and audio feedback
    setPlayingNote(noteId);
    console.log(`Player played: ${notes[noteId].sound}`);
    
    setTimeout(() => setPlayingNote(null), 200);

    const newPlayerSequence = [...playerSequence, noteId];
    setPlayerSequence(newPlayerSequence);

    // Check if current note is correct
    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      setGameStatus('wrong');
      setTimeout(() => {
        setGameStatus('start');
      }, 2000);
      return;
    }

    // Check if sequence is complete
    if (newPlayerSequence.length === sequence.length) {
      setGameStatus('correct');
      setScore(prev => prev + level * 100);
      
      setTimeout(() => {
        const nextLevel = level + 1;
        setLevel(nextLevel);
        generateSequence(Math.min(nextLevel + 2, 8)); // Max 8 notes in sequence
      }, 1500);
    }
  };

  const getNoteClass = (noteId: number) => {
    const note = notes[noteId];
    let baseClass = `${note.color} transition-all duration-200 transform`;
    
    if (playingNote === noteId) {
      baseClass += ' scale-110 brightness-150 shadow-lg';
    } else if (gameStatus === 'playing') {
      baseClass += ' hover:scale-105 hover:brightness-110 cursor-pointer';
    } else {
      baseClass += ' cursor-default';
    }
    
    return baseClass;
  };

  const resetGame = () => {
    setGameStatus('start');
    setSequence([]);
    setPlayerSequence([]);
    setLevel(1);
    setScore(0);
    setPlayingNote(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 text-white p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-6">🎵 Music Memory</h1>
        
        {gameStatus !== 'start' && (
          <div className="mb-6 grid grid-cols-2 gap-4 text-lg">
            <div className="bg-purple-600 rounded-lg p-3">
              <div className="text-sm">Level</div>
              <div className="text-2xl font-bold">{level}</div>
            </div>
            <div className="bg-blue-600 rounded-lg p-3">
              <div className="text-sm">Score</div>
              <div className="text-2xl font-bold">{score}</div>
            </div>
          </div>
        )}

        {gameStatus === 'start' && (
          <div className="space-y-6">
            <div className="text-lg mb-6">
              🎼 Listen to the musical sequence, then repeat it!<br/>
              Each note has a unique sound and color.
            </div>
            <Button onClick={startGame} className="w-full text-xl py-4">
              Start Game 🎵
            </Button>
          </div>
        )}

        {gameStatus === 'showing' && (
          <div className="mb-6">
            <div className="text-xl mb-4">🎧 Listen to the sequence!</div>
            <div className="text-lg">
              Note {showingIndex + 1} of {sequence.length}
            </div>
          </div>
        )}

        {gameStatus === 'playing' && (
          <div className="mb-6">
            <div className="text-xl mb-4">🎹 Repeat the sequence!</div>
            <div className="text-lg">
              Progress: {playerSequence.length} / {sequence.length}
            </div>
          </div>
        )}

        {gameStatus === 'correct' && (
          <div className="mb-6">
            <div className="text-2xl text-green-400 mb-2">🎉 Perfect harmony!</div>
            <div>Level {level} complete! Get ready for level {level + 1}...</div>
          </div>
        )}

        {gameStatus === 'wrong' && (
          <div className="mb-6">
            <div className="text-2xl text-red-400 mb-2">🎵 Off-key!</div>
            <div>The correct sequence was: {sequence.map(id => notes[id].name).join(' → ')}</div>
            <div className="mt-2">Final Score: {score}</div>
          </div>
        )}

        {/* Musical Notes Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {notes.map((note) => (
            <button
              key={note.id}
              className={`
                w-20 h-20 rounded-full border-4 border-white/40 flex flex-col items-center justify-center
                ${getNoteClass(note.id)}
              `}
              onClick={() => handleNoteClick(note.id)}
              disabled={gameStatus !== 'playing'}
            >
              <div className="text-white font-bold text-xs">{note.sound}</div>
              <div className="text-white text-xs">{note.name}</div>
            </button>
          ))}
        </div>

        {/* Player Progress Indicator */}
        {playerSequence.length > 0 && gameStatus === 'playing' && (
          <div className="mb-4">
            <div className="text-sm mb-2">Your sequence:</div>
            <div className="flex justify-center gap-2">
              {playerSequence.map((noteId, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full ${notes[noteId].color} border-2 border-white/60 flex items-center justify-center`}
                >
                  <span className="text-xs font-bold text-white">{notes[noteId].sound}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sequence Preview (for showing phase) */}
        {gameStatus === 'showing' && (
          <div className="mb-4">
            <div className="text-sm mb-2">Sequence to remember:</div>
            <div className="flex justify-center gap-2">
              {sequence.map((noteId, index) => (
                <div
                  key={index}
                  className={`
                    w-8 h-8 rounded-full border-2 border-white/60 flex items-center justify-center
                    ${index <= showingIndex ? notes[noteId].color : 'bg-gray-600'}
                  `}
                >
                  <span className="text-xs font-bold text-white">
                    {index <= showingIndex ? notes[noteId].sound : '?'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {gameStatus === 'wrong' && (
          <Button onClick={resetGame} className="w-full mt-4">
            Play Again 🎵
          </Button>
        )}

        <div className="mt-6 text-xs text-gray-300">
          💡 Tip: Each color represents a different musical note. Listen carefully to the pitch!
        </div>
      </div>
    </div>
  );
};

export default MusicMemory;
