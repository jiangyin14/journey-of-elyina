'use client';

import { useGameEngine } from '@/hooks/useGameEngine';
import PlayerHand from './PlayerHand';
import PlayerStatus from './PlayerStatus';
import EnemyDisplay from './Enemy';
import ActionLog from './ActionLog';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import type { CardData } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Award, Frown } from 'lucide-react';
import CardComponent from './Card'; // Import CardComponent

export default function GameBoard() {
  const { gameState, playCard, endTurn, restartGame } = useGameEngine();
  const [draggedCard, setDraggedCard] = useState<CardData | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number, y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleCardMouseDown = (card: CardData, event: React.MouseEvent) => {
    setDraggedCard(card);
    setIsDragging(true);
    setDragPosition({ x: event.clientX, y: event.clientY });
  };
  
  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDragging && dragPosition) {
      setDragPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    if (draggedCard && isDragging) {
      const dropTarget = (event.target as HTMLElement).closest('[data-enemy-id]');
      if (dropTarget) {
        playCard(draggedCard);
      }
    }
    setDraggedCard(null);
    setIsDragging(false);
    setDragPosition(null);
  };

  if (gameState.isGameOver) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
        {gameState.isGameOver === 'win' ? (
            <Award className="w-24 h-24 text-primary" />
        ) : (
            <Frown className="w-24 h-24 text-destructive" />
        )}
        <h2 className="text-5xl font-headline font-bold text-primary">
          {gameState.isGameOver === 'win' ? '胜利！' : '失败...'}
        </h2>
        <p className="text-muted-foreground">
            {gameState.isGameOver === 'win' ? '你击败了敌人！' : '你的旅程到此为止。'}
        </p>
        <Button onClick={restartGame} size="lg">重新开始</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 gap-4" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={() => setIsDragging(false)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 min-h-0">
        <div className="md:col-span-2 flex items-center justify-center">
          <div>
            <EnemyDisplay enemy={gameState.enemy} />
          </div>
        </div>
        <ActionLog log={gameState.actionLog} />
      </div>

      <div className="h-[40vh] border-t-2 border-primary/20 pt-4 flex flex-col md:flex-row gap-4">
        <div className="flex flex-col gap-4 w-full md:w-64">
          <PlayerStatus player={gameState.player} />
          <Button onClick={endTurn} disabled={!gameState.isPlayerTurn} className="w-full font-bold">
            结束回合
          </Button>
        </div>
        <div className="flex-1 min-h-0">
          <PlayerHand
            hand={gameState.player.hand}
            onCardMouseDown={handleCardMouseDown}
            draggedCard={draggedCard}
          />
        </div>
      </div>
       {isDragging && draggedCard && dragPosition && (
         <div className="fixed top-0 left-0 pointer-events-none" style={{ transform: `translate(${dragPosition.x - 110}px, ${dragPosition.y - 165}px)`, zIndex: 100 }}>
            <CardComponent card={draggedCard} onMouseDown={() => {}} isDragged={true} />
         </div>
       )}
    </div>
  );
}
