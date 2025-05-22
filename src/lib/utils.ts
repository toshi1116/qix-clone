import { GameState, Enemy, Player } from '../types';

/**
 * ゲームの初期状態を作成
 */
export const createInitialGameState = (): GameState => ({
  canvasSize: { width: 800, height: 600 },
  player: {
    position: { x: 400, y: 300 },
    size: 20,
    speed: 5,
  },
  enemies: [
    {
      position: { x: 100, y: 100 },
      velocity: { x: 2, y: 2 },
      radius: 10,
    },
    {
      position: { x: 700, y: 500 },
      velocity: { x: -2, y: -2 },
      radius: 10,
    },
  ],
  walls: [
    [
      { x: 0, y: 0 },
      { x: 0, y: 600 },
      { x: 800, y: 600 },
      { x: 800, y: 0 },
      { x: 0, y: 0 },
    ],
  ],
  lines: [],
  score: 0,
  lives: 3,
  capturePercentage: 0,
  backgroundImage: null,
});
