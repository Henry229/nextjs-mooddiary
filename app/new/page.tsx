'use client';

import { useRouter } from 'next/navigation';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createEntry } from '../actions/diary';
import { useState } from 'react';

export default function NewDiary() {
  const router = useRouter();
  const [date, setDate] = useState<Date>(new Date());
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !content.trim() || isLoading) return;

    try {
      setIsLoading(true);
      await createEntry(date.toISOString(), content.trim());
      router.push('/');
    } catch (error) {
      console.error('일기 작성 실패:', error);
      alert('일기 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
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
          disabled={isLoading}
        />
        <div className='flex justify-end gap-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.back()}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? '저장 중...' : '저장'}
          </Button>
        </div>
      </form>
    </div>
  );
}
