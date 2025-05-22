import React from 'react';
import { GameState } from '../types';

interface HUDProps {
  gameState: GameState;
  onBackgroundChange: (image: File) => void;
  onGameReset: () => void;
}

export const HUD: React.FC<HUDProps> = ({ gameState, onBackgroundChange, onGameReset }) => {
  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onBackgroundChange(e.target.files[0]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="mr-2">取得率:</span>
          <div className="w-32 h-4 bg-gray-600 rounded-full">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${gameState.capturePercentage}%` }}
            />
          </div>
        </div>
        <div className="flex items-center">
          <span className="mr-2">スコア:</span>
          <span>{Math.floor(gameState.capturePercentage * 100)}</span>
        </div>
      </div>
      <div className="flex items-center mb-4">
        <span className="mr-2">残ライフ:</span>
        {[...Array(gameState.lives)].map((_, i) => (
          <span key={i} className="text-red-500">♥</span>
        ))}
      </div>
      <div className="flex gap-2">
        <label className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleBackgroundChange}
            className="hidden"
            id="backgroundImage"
          />
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => document.getElementById('backgroundImage')?.click()}
          >
            背景画像を変更
          </button>
        </label>
        <button
          type="button"
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={onGameReset}
        >
          ゲームリセット
        </button>
      </div>
    </div>
  );
};
