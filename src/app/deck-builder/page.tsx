import DeckBuilderClient from '@/components/deck-builder/DeckBuilderClient';

export default function DeckBuilderPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-headline font-bold mb-2">旅行准备</h1>
      <p className="text-muted-foreground mb-8">整理你的魔法卡牌，为下一段旅程做好准备。</p>
      <DeckBuilderClient />
    </div>
  );
}
