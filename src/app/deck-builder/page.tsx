import DeckBuilderClient from '@/components/deck-builder/DeckBuilderClient';

export default function DeckBuilderPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-headline font-bold mb-2">卡组编辑器</h1>
      <p className="text-muted-foreground mb-8">构建你的完美卡组。卡组限制为 15 张牌。</p>
      <DeckBuilderClient />
    </div>
  );
}
