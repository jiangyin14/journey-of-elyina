'use client';

import { useState } from 'react';
import type { CardData } from '@/lib/types';
import { ALL_CARDS, INITIAL_DECK } from '@/lib/game-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

function SmallCard({ card, onAction, actionLabel }: { card: CardData, onAction: () => void, actionLabel: string }) {
    return (
        <div className="relative w-full aspect-[2.5/3.5] rounded-lg overflow-hidden shadow-md group border">
            <Image src={card.imageUrl} alt={card.name} fill className="object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 p-2 text-white">
                <h3 className="font-bold text-sm truncate">{card.name}</h3>
                <p className="text-xs opacity-80 truncate">{card.description}</p>
            </div>
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="sm" onClick={onAction}>{actionLabel}</Button>
            </div>
        </div>
    );
}

export default function DeckBuilderClient() {
  const [deck, setDeck] = useState<CardData[]>(INITIAL_DECK);
  const { toast } = useToast();
  const DECK_LIMIT = 15;

  const addToDeck = (card: CardData) => {
    if (deck.length >= DECK_LIMIT) {
      toast({ title: "卡组已满", description: `你的卡组不能超过 ${DECK_LIMIT} 张牌。`, variant: "destructive" });
      return;
    }
    setDeck(prev => [...prev, card]);
  };
  
  const removeFromDeck = (cardIndex: number) => {
    setDeck(prev => prev.filter((_, i) => i !== cardIndex));
  };
  
  const saveDeck = () => {
    // Here you would save to Firestore. For now, we just show a toast.
    toast({ title: "卡组已保存", description: "你的新卡组已准备好进行战斗！" });
  }
  
  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">可用卡牌</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-1">
                {ALL_CARDS.map((card, index) => (
                    <SmallCard key={`${card.id}-${index}`} card={card} onAction={() => addToDeck(card)} actionLabel="添加"/>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="font-headline">当前卡组 ({deck.length}/{DECK_LIMIT})</CardTitle>
              <Button onClick={saveDeck}>保存</Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh]">
              <div className="space-y-2 pr-2">
                  {deck.map((card, index) => (
                      <div key={index} className="flex items-center justify-between bg-secondary p-2 rounded-md">
                          <span className="font-medium">{card.name}</span>
                          <Button variant="ghost" size="sm" onClick={() => removeFromDeck(index)}>移除</Button>
                      </div>
                  ))}
                  {deck.length === 0 && <p className="text-muted-foreground text-center py-8">你的卡组是空的。</p>}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
