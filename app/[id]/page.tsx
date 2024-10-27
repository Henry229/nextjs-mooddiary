'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';
import { getEntryById, deleteEntry } from '@/lib/diary';
import Link from 'next/link';

export default function DiaryDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const entry = getEntryById(params.id);

  if (!entry) {
    return <div>일기를 찾을 수 없습니다.</div>;
  }

  const handleDelete = () => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      deleteEntry(params.id);
      router.push('/');
    }
  };

  return (
    <div className='container mx-auto py-8'>
      <Card>
        <CardHeader className='flex flex-row justify-between items-center'>
          <div className='text-sm text-muted-foreground'>
            {new Date(entry.date).toLocaleDateString('ko-KR')}
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
