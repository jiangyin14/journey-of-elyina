import Image from 'next/image';
import type { Enemy } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Shield, Sword, Skull } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const enemyImage = PlaceHolderImages.find(img => img.id === 'enemy-goblin');

const IntentIcon = ({ intentType }: { intentType: 'attack' | 'defend' | 'debuff' }) => {
  switch (intentType) {
    case 'attack': return <Sword className="w-4 h-4" />;
    case 'defend': return <Shield className="w-4 h-4" />;
    case 'debuff': return <Skull className="w-4 h-4" />;
    default: return null;
  }
};

export default function EnemyDisplay({ enemy }: { enemy: Enemy }) {
  const hpPercentage = (enemy.hp / enemy.maxHp) * 100;

  return (
    <div data-enemy-id={enemy.id}>
        <Card className="w-80 text-center border-2 border-primary/50 shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-200 cursor-pointer">
        <CardHeader>
            <CardTitle className="font-headline text-2xl">{enemy.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
            <div className="relative">
            <Image
                src={enemyImage?.imageUrl || "https://picsum.photos/seed/enemy/300/300"}
                alt={enemy.name}
                width={200}
                height={200}
                className="rounded-full border-4 border-secondary object-cover"
                data-ai-hint={enemyImage?.imageHint || "fantasy monster"}
                unoptimized
            />
            <div className="absolute -top-2 -right-2 bg-card border rounded-full p-2 flex items-center gap-1 text-lg font-bold">
                <IntentIcon intentType={enemy.intent.type} />
                {enemy.intent.value}
            </div>
            </div>
            <div className="w-full space-y-2">
            <Progress value={hpPercentage} className="h-4" />
            <p className="text-center font-bold text-lg">{enemy.hp} / {enemy.maxHp}</p>
            </div>
        </CardContent>
        </Card>
    </div>
  );
}
