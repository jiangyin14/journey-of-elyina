'use client';

import React from 'react';
import Image from 'next/image';
import type { CardData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sword, Brain, Zap, Wand } from 'lucide-react';

const CardIcon = ({ type }: { type: CardData['type'] }) => {
  const props = { className: "w-4 h-4" };
  switch (type) {
    case 'attack': return <Sword {...props} />;
    case 'skill': return <Brain {...props} />;
    case 'defense': return <Wand {...props} />;
    default: return <Zap {...props} />;
  }
}

interface CardComponentProps {
  card: CardData;
  onMouseDown: (e: React.MouseEvent) => void;
  isDragged: boolean;
}

export default function CardComponent({ card, onMouseDown, isDragged }: CardComponentProps) {
  const cardStyle: React.CSSProperties = {
    transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
    transform: isDragged ? 'scale(1.1) rotate(0deg) translateY(-20px)' : '',
    boxShadow: isDragged ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : ''
  };
  
  const costLabel = `${card.steps}步 / ${card.cost}魔`;

  return (
    <div
      onMouseDown={onMouseDown}
      className="cursor-grab active:cursor-grabbing"
    >
      <Card
        className="w-[220px] h-[330px] flex flex-col select-none overflow-hidden relative border-2"
        style={cardStyle}
      >
        <CardHeader className="p-3">
          <div className="flex justify-between items-start">
            <CardTitle className="font-headline text-lg leading-tight">{card.name}</CardTitle>
            <div className="flex items-center justify-center h-8 px-2 rounded-full bg-primary text-primary-foreground font-bold text-sm">
              {costLabel}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 relative">
          <Image
            src={card.imageUrl}
            alt={card.name}
            fill
            className="object-cover"
            data-ai-hint={card.imageHint}
            unoptimized
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 text-primary-foreground">
             <p className="text-xs">{card.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
