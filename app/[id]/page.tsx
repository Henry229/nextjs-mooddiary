'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Pencil, Trash2, Meh } from 'lucide-react';
import { getEntryById, deleteEntry } from '@/lib/diary';
import { MOOD_ICONS } from '@/lib/mood';
import type { MoodType } from '@/types/diaryType';
import Link from 'next/link';

export default function DiaryDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const entry = getEntryById(params.id);

  if (!entry) {
    return <div>일기를 찾을 수 없습니다.</div>;
  }

  // 타입 안전성을 위한 처리
  const mood = (entry.mood || '평범') as MoodType;
  const MoodIcon = MOOD_ICONS[mood] || Meh;

  const handleDelete = () => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      deleteEntry(params.id);
      router.push('/');
    }
  };

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
            <Button variant='destructive' size='icon' onClick={handleDelete}>
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className='whitespace-pre-wrap'>{entry.content}</p>
        </CardContent>
      </Card>
    </div>
  );
}
