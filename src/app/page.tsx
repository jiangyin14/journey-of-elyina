import GameBoard from '@/components/game/GameBoard';

export default function GamePage() {
  return (
    <div className="w-full h-[calc(100vh-4rem)] overflow-hidden">
      <GameBoard />
    </div>
  );
}
