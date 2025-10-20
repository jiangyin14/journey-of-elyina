import Link from 'next/link';
import { Swords } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Swords className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-headline font-bold text-primary">绯红命运</h1>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-foreground/80 hover:text-foreground transition-colors">
            游戏
          </Link>
          <Link href="/deck-builder" className="text-foreground/80 hover:text-foreground transition-colors">
            卡组
          </Link>
        </nav>
      </div>
    </header>
  );
}
