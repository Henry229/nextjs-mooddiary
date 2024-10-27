'use client';

import { useRouter } from 'next/navigation';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createEntry } from '@/lib/diary';
import { useState } from 'react';

export default function NewDiary() {
  const router = useRouter();
  const [date, setDate] = useState<Date>(new Date());
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !content.trim()) return;

    createEntry(date.toISOString(), content.trim());
    router.push('/');
  };

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-3xl font-bold mb-6'>새 일기 작성</h1>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <Calendar
            mode='single'
            selected={date}
            onSelect={(date) => setDate(date || new Date())}
            className='rounded-md border'
          />
        </div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='오늘의 일기를 작성해주세요...'
          className='min-h-[300px]'
        />
        <div className='flex justify-end gap-4'>
          <Button type='button' variant='outline' onClick={() => router.back()}>
            취소
          </Button>
          <Button type='submit'>저장</Button>
        </div>
      </form>
    </div>
  );
}
