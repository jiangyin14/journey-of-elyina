'use client';

import React from 'react';
import Image from 'next/image';
import type { CardData } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sword, BrainCircuit, Star } from 'lucide-react';

const CardIcon = ({ type }: { type: CardData['type'] }) => {
  const props = { className: "w-4 h-4" };
  switch (type) {
    case 'attack': return <Sword {...props} />;
    case 'skill': return <BrainCircuit {...props} />;
    case 'power': return <Star {...props} />;
    default: return null;
  }
}

interface CardComponentProps {
  card: CardData;
  onDragStart: (card: CardData | null) => void;
  isDragged: boolean;
}

export default function CardComponent({ card, onDragStart, isDragged }: CardComponentProps) {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onDragStart(card);
  };

  const cardStyle: React.CSSProperties = {
    transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
    transform: isDragged ? 'scale(1.1) translateY(-20px)' : '',
    boxShadow: isDragged ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : ''
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      className="cursor-grab active:cursor-grabbing"
    >
      <Card
        className="w-[220px] h-[330px] flex flex-col select-none overflow-hidden relative border-2"
        style={cardStyle}
      >
        <CardHeader className="p-3">
          <div className="flex justify-between items-start">
            <CardTitle className="font-headline text-lg leading-tight">{card.name}</CardTitle>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-lg">
              {card.cost}
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
            <div className="flex items-center gap-2 pb-1 font-bold text-sm">
              <CardIcon type={card.type} />
              <span className="capitalize">{card.type === 'attack' ? '攻击' : '技能'}</span>
            </div>
             <p className="text-xs">{card.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
