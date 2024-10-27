// components/DiaryList.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getAllEntries } from '@/lib/diary';
import type { DiaryEntry } from '@/types/diaryType';

export default function DiaryList() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    setEntries(getAllEntries());
  }, []);

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {entries.map((entry) => (
        <Link key={entry.id} href={`/${entry.id}`}>
          <Card className='hover:bg-accent transition-colors'>
            <CardHeader className='text-sm text-muted-foreground'>
              {new Date(entry.date).toLocaleDateString('ko-KR')}
            </CardHeader>
            <CardContent>
              <p className='line-clamp-3'>{entry.content}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
