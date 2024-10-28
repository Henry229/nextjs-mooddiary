import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Pencil, Meh } from 'lucide-react';
import { getEntryById } from '@/app/actions/diary';
import { MOOD_ICONS } from '@/lib/mood';
import type { MoodType } from '@/types/diaryType';
import DeleteButton from './DeleteButton';

export default async function DiaryDetail({
  params,
}: {
  params: { id: string };
}) {
  const entry = await getEntryById(params.id);

  if (!entry) {
    notFound();
  }

  const mood = (entry.mood || '평범') as MoodType;
  const MoodIcon = MOOD_ICONS[mood] || Meh;

  return (
    <div className='container mx-auto py-8'>
      <Card
        style={{
          backgroundColor: entry.moodColor ? `${entry.moodColor}20` : undefined,
          borderColor: entry.moodColor ? entry.moodColor : undefined,
        }}
      >
        <CardHeader className='flex flex-row justify-between items-center'>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <span>{new Date(entry.date).toLocaleDateString('ko-KR')}</span>
            <div className='flex items-center gap-1'>
              <MoodIcon
                className='h-5 w-5'
                style={{ color: entry.moodColor }}
              />
              <span style={{ color: entry.moodColor }}>
                {entry.mood || '평범'}
              </span>
            </div>
          </div>
          <div className='flex gap-2'>
            <Link href={`/edit/${params.id}`}>
              <Button variant='outline' size='icon'>
                <Pencil className='h-4 w-4' />
              </Button>
            </Link>
            <DeleteButton id={params.id} />
          </div>
        </CardHeader>
        <CardContent>
          <p className='whitespace-pre-wrap'>{entry.content}</p>
        </CardContent>
      </Card>
    </div>
  );
}
