import DiaryForm from '@/components/DiaryForm';
import DiaryList from '@/components/DiaryList';

export default function Home() {
  return (
    <main className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>나의 일기장</h1>
      <div className='grid gap-8'>
        <section>
          <h2 className='text-xl font-semibold mb-4'>새 일기 작성</h2>
          <DiaryForm />
        </section>
        <section>
          <h2 className='text-xl font-semibold mb-4'>일기 목록</h2>
          <DiaryList />
        </section>
      </div>
    </main>
  );
}
