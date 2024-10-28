import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { MoodType } from '@/types/diaryType';
import { getAllEntries } from '@/app/actions/diary';
import { MOOD_ICONS } from '@/lib/mood';
import { Meh } from 'lucide-react';

export default async function DiaryList() {
  const entries = await getAllEntries();

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {entries.map((entry) => {
        const mood = (entry.mood || '평범') as MoodType;
        const MoodIcon = MOOD_ICONS[mood] || Meh;

        return (
          <Link key={entry.id} href={`/${entry.id}`}>
            <Card
              className='hover:bg-accent transition-colors'
              style={{
                backgroundColor: entry.moodColor
                  ? `${entry.moodColor}20`
                  : undefined,
                borderColor: entry.moodColor ? entry.moodColor : undefined,
              }}
            >
              <CardHeader className='flex flex-row justify-between items-center text-sm text-muted-foreground'>
                <span>{new Date(entry.date).toLocaleDateString('ko-KR')}</span>
                <MoodIcon
                  className='h-5 w-5'
                  style={{ color: entry.moodColor }}
                />
              </CardHeader>
              <CardContent>
                <p className='line-clamp-3'>{entry.content}</p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
