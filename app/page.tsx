import DiaryList from '@/components/DiaryList';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className='container mx-auto py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>일기장 목록</h1>
        <Link href='/new'>
          <Button>
            <PlusCircle className='mr-2 h-4 w-4' />새 일기 작성
          </Button>
        </Link>
      </div>
      <DiaryList />
    </div>
  );
}
