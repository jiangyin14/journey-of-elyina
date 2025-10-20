import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ActionLog({ log }: { log: string[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">旅行日志</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[250px] w-full pr-4">
          <div className="space-y-2 text-sm">
            {log.slice().reverse().map((entry, index) => (
              <p key={index} className="text-foreground/80">{entry}</p>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
