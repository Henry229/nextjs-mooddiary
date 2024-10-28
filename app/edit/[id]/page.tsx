'use client';

import { useRouter } from 'next/navigation';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { getEntryById, updateEntry } from '@/app/actions/diary';
import { useState, useEffect } from 'react';

export default function EditDiary({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [date, setDate] = useState<Date>(new Date());
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchEntry() {
      try {
        const entry = await getEntryById(params.id);
        if (entry) {
          setDate(new Date(entry.date));
          setContent(entry.content);
        }
      } catch (error) {
        console.error('일기 가져오기 실패:', error);
      }
    }

    fetchEntry();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !content.trim() || isLoading) return;

    try {
      setIsLoading(true);
      await updateEntry(params.id, date.toISOString(), content.trim());
      router.push('/');
      router.refresh(); // 목록 페이지 새로고침을 위해 추가
    } catch (error) {
      console.error('일기 수정 실패:', error);
      alert('일기 수정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-3xl font-bold mb-6'>일기 수정</h1>
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
          placeholder='일기 내용을 수정해주세요...'
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
