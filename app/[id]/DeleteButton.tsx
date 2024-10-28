'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteEntry } from '../actions/diary';

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      await deleteEntry(id);
      router.push('/');
      router.refresh();
    }
  };

  return (
    <Button variant='destructive' size='icon' onClick={handleDelete}>
      <Trash2 className='h-4 w-4' />
    </Button>
  );
}
