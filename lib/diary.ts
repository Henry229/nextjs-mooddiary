export const storageKey = 'diary-entries';
import type { DiaryEntry } from '@/types/diaryType';
import { analyzeMood, MOOD_COLORS } from './mood';

export const getAllEntries = (): DiaryEntry[] => {
  if (typeof window === 'undefined') return [];
  const entries = localStorage.getItem(storageKey);
  return entries ? JSON.parse(entries) : [];
};

export const getEntryById = (id: string): DiaryEntry | undefined => {
  const entries = getAllEntries();
  return entries.find((entry) => entry.id === id);
};

export const createEntry = async (
  date: string,
  content: string
): Promise<DiaryEntry> => {
  const entries = getAllEntries();
  const mood = await analyzeMood(content);

  const newEntry: DiaryEntry = {
    id: crypto.randomUUID(),
    date,
    content,
    mood,
    moodColor: MOOD_COLORS[mood],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(storageKey, JSON.stringify([newEntry, ...entries]));
  return newEntry;
};

export const updateEntry = async (
  id: string,
  date: string,
  content: string
): Promise<DiaryEntry> => {
  const entries = getAllEntries();
  const mood = await analyzeMood(content);

  const updatedEntries = entries.map((entry) => {
    if (entry.id === id) {
      return {
        ...entry,
        date,
        content,
        mood,
        moodColor: MOOD_COLORS[mood],
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
