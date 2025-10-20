'use client';
import React from 'react';
import type { CardData } from '@/lib/types';
import CardComponent from './Card';

interface PlayerHandProps {
  hand: CardData[];
  onCardMouseDown: (card: CardData, e: React.MouseEvent) => void;
  draggedCard: CardData | null;
}

export default function PlayerHand({ hand, onCardMouseDown, draggedCard }: PlayerHandProps) {

  const handSize = hand.length;
  const spreadAngle = Math.min(handSize * 10, 80);
  const startAngle = -spreadAngle / 2;
  const angleStep = handSize > 1 ? spreadAngle / (handSize - 1) : 0;

  return (
    <div className="relative w-full h-full flex justify-center items-end pb-8">
      {hand.map((card, index) => {
        const isDragged = draggedCard === card;
        const rotation = handSize > 1 ? startAngle + index * angleStep : 0;
        const translateY = Math.abs(rotation) / 1.5;

        return (
          <div
            key={`${card.id}-${index}`}
            className="absolute origin-bottom-center transition-transform duration-300 ease-out hover:scale-110 hover:-translate-y-8"
            style={{
              transform: `rotate(${rotation}deg) translateY(${translateY}px)`,
              zIndex: isDragged ? 100 : index,
              opacity: isDragged ? 0 : 1,
            }}
          >
            <CardComponent
              card={card}
              onMouseDown={(e) => onCardMouseDown(card, e)}
              isDragged={false} // Visual dragging is handled in GameBoard
            />
          </div>
        );
      })}
    </div>
  );
}
