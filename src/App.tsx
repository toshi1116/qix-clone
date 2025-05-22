import React, { useState, useEffect } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { GameState, Enemy, Player } from './types';
import { createInitialGameState } from './lib/utils';

function App() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());

  const handleGameStateChange = (newState: Partial<GameState>) => {
    setGameState(prev => ({
      ...prev,
      ...newState,
    }));
  };

  const handleBackgroundChange = (image: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      handleGameStateChange({
        backgroundImage: e.target?.result as string,
      });
    };
    reader.readAsDataURL(image);
  };

  const handleGameReset = () => {
    setGameState(createInitialGameState());
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl text-white mb-8 text-center">QIX Clone</h1>
        <div className="relative">
          <GameCanvas
            gameState={gameState}
            onGameStateChange={handleGameStateChange}
          />
          <HUD
            gameState={gameState}
            onBackgroundChange={handleBackgroundChange}
            onGameReset={handleGameReset}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
