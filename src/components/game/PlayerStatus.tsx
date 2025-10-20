import type { Player } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Droplets, Shield, Library, Layers, Footprints } from 'lucide-react';

const Stat = ({ icon, value, maxValue, label, colorClass = 'text-primary' }: { icon: React.ReactNode, value: number, maxValue?: number, label: string, colorClass?: string }) => (
  <div className="flex items-center gap-3 text-lg">
    <div className={colorClass}>{icon}</div>
    <div className="flex-1 font-bold">
      {label}: {value}{maxValue !== undefined ? ` / ${maxValue}` : ''}
    </div>
  </div>
);

export default function PlayerStatus({ player }: { player: Player }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">伊蕾娜的状态</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Stat icon={<Heart />} value={player.hp} maxValue={player.maxHp} label="体力" colorClass="text-red-500" />
        <Stat icon={<Droplets />} value={player.mana} maxValue={player.maxMana} label="魔力" colorClass="text-blue-500" />
        <Stat icon={<Footprints />} value={player.steps} maxValue={player.maxSteps} label="步数" colorClass="text-yellow-600" />
        <Stat icon={<Shield />} value={player.block} label="护盾" colorClass="text-gray-500" />
        <div className="flex gap-4 pt-2 border-t mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Library className="w-4 h-4"/> 卡组: {player.deck.length}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Layers className="w-4 h-4"/> 弃牌堆: {player.discard.length}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
