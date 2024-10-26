import { Diary } from './types';

// localStorage에서 일기 목록 가져오기
export const getDiaries = (): Diary[] => {
  if (typeof window === 'undefined') return [];
  const diaries = localStorage.getItem('diaries');
  return diaries ? JSON.parse(diaries) : [];
};

// 새 일기 저장
export const saveDiary = (
  diary: Omit<Diary, 'id' | 'createdAt' | 'updatedAt'>
) => {
  const diaries = getDiaries();
  const newDiary: Diary = {
    ...diary,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  localStorage.setItem('diaries', JSON.stringify([newDiary, ...diaries]));
  return newDiary;
};

// 일기 수정
export const updateDiary = (id: string, diary: Partial<Diary>) => {
  const diaries = getDiaries();
  const updatedDiaries = diaries.map((d) =>
    d.id === id ? { ...d, ...diary, updatedAt: new Date() } : d
  );
  localStorage.setItem('diaries', JSON.stringify(updatedDiaries));
};

// 일기 삭제
export const deleteDiary = (id: string) => {
  const diaries = getDiaries();
  const filteredDiaries = diaries.filter((d) => d.id !== id);
  localStorage.setItem('diaries', JSON.stringify(filteredDiaries));
};
