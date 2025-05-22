import React, { useEffect, useRef, useState } from 'react';
import { Point, GameState, Enemy, Player } from '../types';
import { calculateCapturePercentage, isPointInPolygon } from '../lib/geometry';
import { detectCollision } from '../lib/collision';

interface GameCanvasProps {
  gameState: GameState;
  onGameStateChange: (newState: GameState) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, onGameStateChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * 0.8;
      canvas.height = window.innerHeight * 0.8;
      onGameStateChange({
        ...gameState,
        canvasSize: { width: canvas.width, height: canvas.height },
      });
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      drawGame(ctx);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [gameState]);

  const drawGame = (ctx: CanvasRenderingContext2D) => {
    // 背景をクリア
    ctx.clearRect(0, 0, gameState.canvasSize.width, gameState.canvasSize.height);

    // 背景画像を描画
    if (gameState.backgroundImage) {
      const img = new Image();
      img.src = gameState.backgroundImage;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, gameState.canvasSize.width, gameState.canvasSize.height);
      };
    }

    // 未取得エリアを半透明黒でマスク
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, gameState.canvasSize.width, gameState.canvasSize.height);

    // 取得済みエリアをフルカラーで表示
    gameState.walls.forEach(wall => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.beginPath();
      wall.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.closePath();
      ctx.fill();
    });

    // プレイヤーを描画
    ctx.fillStyle = 'blue';
    ctx.fillRect(
      gameState.player.position.x - gameState.player.size / 2,
      gameState.player.position.y - gameState.player.size / 2,
      gameState.player.size,
      gameState.player.size
    );

    // 敵を描画
    ctx.fillStyle = 'red';
    gameState.enemies.forEach(enemy => {
      ctx.beginPath();
      ctx.arc(enemy.position.x, enemy.position.y, enemy.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // ラインを描画
    if (isDrawing && startPoint) {
      ctx.strokeStyle = 'blue';
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(gameState.player.position.x, gameState.player.position.y);
      ctx.stroke();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onGameStateChange({
      ...gameState,
      player: {
        ...gameState.player,
        position: { x, y },
      },
    });
  };

  const handleMouseDown = () => {
    setIsDrawing(true);
    setStartPoint(gameState.player.position);
  };

  const handleMouseUp = () => {
    if (!isDrawing || !startPoint) return;

    const newLine = [
      startPoint,
      gameState.player.position,
    ];

    // 閉路判定
    const isClosed = gameState.walls.some(wall => {
      return wall[0].x === gameState.player.position.x &&
             wall[0].y === gameState.player.position.y;
    });

    if (isClosed) {
      // 閉路成立時、取得エリアを更新
      const newWalls = gameState.walls.concat([newLine]);
      const capturePercentage = calculateCapturePercentage(
        gameState.canvasSize,
        newWalls
      );

      onGameStateChange({
        ...gameState,
        walls: newWalls,
        capturePercentage,
        score: Math.floor(capturePercentage * 100),
      });
    } else {
      // 閉路でない場合はラインを追加
      onGameStateChange({
        ...gameState,
        lines: [...gameState.lines, newLine],
      });
    }

    setIsDrawing(false);
    setStartPoint(null);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className="border-2 border-gray-400 rounded-lg"
    />
  );
};
