// 座標
export type Point = {
  x: number;
  y: number;
};

// 敵の状態
export type Enemy = {
  position: Point;
  velocity: Point;
  radius: number;
};

// プレイヤーの状態
export type Player = {
  position: Point;
  size: number;
  speed: number;
};

// ゲームの状態
export type GameState = {
  canvasSize: { width: number; height: number };
  player: Player;
  enemies: Enemy[];
  walls: Point[][];
  lines: Point[][];
  score: number;
  lives: number;
  capturePercentage: number;
  backgroundImage: string | null;
};

// キーの状態
export type KeyState = {
  ArrowUp: boolean;
  ArrowDown: boolean;
  ArrowLeft: boolean;
  ArrowRight: boolean;
};
