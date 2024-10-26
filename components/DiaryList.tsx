'use client';

import { useEffect, useState } from 'react';
import { Diary } from '@/lib/types';
import { getDiaries, deleteDiary } from '@/lib/diary';
import { Button } from '@/components/ui/button';

export default function DiaryList() {
  const [diaries, setDiaries] = useState<Diary[]>([]);

  useEffect(() => {
    setDiaries(getDiaries());
  }, []);

  const handleDelete = (id: string) => {
    deleteDiary(id);
    setDiaries(getDiaries());
  };

  return (
    <div className='space-y-4'>
      {diaries.map((diary) => (
        <div
          key={diary.id}
          className='p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow'
        >
          <h3 className='text-lg font-semibold'>{diary.title}</h3>
          <p className='text-gray-600 mt-2'>{diary.content}</p>
          <div className='mt-4 flex justify-end space-x-2'>
            <Button variant='outline' onClick={() => handleDelete(diary.id)}>
              삭제
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
