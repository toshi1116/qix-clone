import { Point, GameState } from '../types';

/**
 * Even-Oddルールで点が多角形内にあるか判定
 */
export const isPointInPolygon = (point: Point, polygon: Point[]): boolean => {
  let inside = false;
  const { x, y } = point;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const pi = polygon[i];
    const pj = polygon[j];

    const test1 = (y > Math.min(pi.y, pj.y)) && (y <= Math.max(pi.y, pj.y));
    const test2 = x <= Math.max(pi.x, pj.x);
    const test3 = pi.y !== pj.y;
    const test4 = (x - pi.x) * (pj.y - pi.y) / (pj.x - pi.x) + pi.y;

    if (test1 && test2 && test3 && y <= test4) {
      inside = !inside;
    }
  }

  return inside;
};

/**
 * 取得率を計算
 */
export const calculateCapturePercentage = (canvasSize: { width: number; height: number }, walls: Point[][]): number => {
  const totalArea = canvasSize.width * canvasSize.height;
  let capturedArea = 0;

  // 各壁で囲まれたエリアを計算
  walls.forEach(wall => {
    // 原点からの多角形を作成
    const polygon = [...wall, wall[0]];
    
    // 多角形の面積を計算（Shoelace formula）
    let area = 0;
    for (let i = 0; i < polygon.length - 1; i++) {
      area += polygon[i].x * polygon[i + 1].y;
      area -= polygon[i + 1].x * polygon[i].y;
    }
    area = Math.abs(area) / 2;

    capturedArea += area;
  });

  return capturedArea / totalArea;
};
