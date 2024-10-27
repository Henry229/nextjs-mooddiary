import { DiaryEntry } from '@/app/types/dairy';
export const storageKey = 'diary-entries';

export const getAllEntries = (): DiaryEntry[] => {
  if (typeof window === 'undefined') return [];
  const entries = localStorage.getItem(storageKey);
  return entries ? JSON.parse(entries) : [];
};

export const getEntryById = (id: string): DiaryEntry | undefined => {
  const entries = getAllEntries();
  return entries.find((entry) => entry.id === id);
};

export const createEntry = (date: string, content: string): DiaryEntry => {
  const entries = getAllEntries();
  const newEntry: DiaryEntry = {
    id: crypto.randomUUID(),
    date,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(storageKey, JSON.stringify([newEntry, ...entries]));
  return newEntry;
};

export const updateEntry = (
  id: string,
  date: string,
  content: string
): DiaryEntry => {
  const entries = getAllEntries();
  const updatedEntries = entries.map((entry) => {
    if (entry.id === id) {
      return {
        ...entry,
        date,
        content,
        updatedAt: new Date().toISOString(),
      };
    }
    return entry;
  });

  localStorage.setItem(storageKey, JSON.stringify(updatedEntries));
  return updatedEntries.find((entry) => entry.id === id)!;
};

export const deleteEntry = (id: string): void => {
  const entries = getAllEntries();
  const filteredEntries = entries.filter((entry) => entry.id !== id);
  localStorage.setItem(storageKey, JSON.stringify(filteredEntries));
};
