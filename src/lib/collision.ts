import { Point, Enemy, Player } from '../types';

/**
 * 2点間の距離を計算
 */
const distance = (p1: Point, p2: Point): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

/**
 * 敵とラインの衝突判定
 */
export const detectCollision = (
  enemy: Enemy,
  line: [Point, Point],
  player: Player
): boolean => {
  const [p1, p2] = line;
  const { position, radius } = enemy;

  // 敵の中心から線分の両端までの距離
  const d1 = distance(position, p1);
  const d2 = distance(position, p2);

  // 敵の中心から線分の最短距離を計算
  const t = ((position.x - p1.x) * (p2.x - p1.x) +
            (position.y - p1.y) * (p2.y - p1.y)) /
           (Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

  const closestX = p1.x + t * (p2.x - p1.x);
  const closestY = p1.y + t * (p2.y - p1.y);

  const closestDist = distance(position, { x: closestX, y: closestY });

  // 敵が線分の範囲内にいるかチェック
  const isWithinLine = t >= 0 && t <= 1;

  // 敵が線分に衝突しているか
  const isColliding = closestDist <= radius && isWithinLine;

  return isColliding;
};

/**
 * 敵の反射角度を計算
 */
export const calculateReflection = (
  enemy: Enemy,
  line: [Point, Point],
  player: Player
): Point => {
  const [p1, p2] = line;
  const { position, velocity } = enemy;

  // 線分の法線ベクトルを計算
  const normal = {
    x: p2.y - p1.y,
    y: -(p2.x - p1.x)
  };

  // 法線ベクトルの長さを1に正規化
  const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
  normal.x /= length;
  normal.y /= length;

  // 反射ベクトルを計算
  const dot = velocity.x * normal.x + velocity.y * normal.y;
  const reflection = {
    x: velocity.x - 2 * dot * normal.x,
    y: velocity.y - 2 * dot * normal.y
  };

  // ランダムな角度のばらつきを追加
  const angleVariation = (Math.random() - 0.5) * Math.PI / 12; // 最大±15度
  const angle = Math.atan2(reflection.y, reflection.x) + angleVariation;

  return {
    x: Math.cos(angle),
    y: Math.sin(angle)
  };
};
