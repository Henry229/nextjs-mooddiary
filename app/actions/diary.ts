'use server';

import { prisma } from '@/lib/prisma';
import { analyzeMood } from './mood';
import { MOOD_COLORS } from '@/lib/mood';
import { revalidatePath } from 'next/cache';
// import { DiaryEntry } from '@/types/diaryType';

export async function getAllEntries() {
  const entries = await prisma.diaryEntry.findMany({
    orderBy: {
      date: 'desc',
    },
  });

  return entries.map((entry) => ({
    ...entry,
    date: entry.date.toISOString(),
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
    mood: entry.mood || undefined,
    moodColor: entry.moodColor || undefined,
  }));
}

export async function getEntryById(id: string) {
  const entry = await prisma.diaryEntry.findUnique({
    where: { id },
  });

  if (!entry) return null;

  return {
    ...entry,
    date: entry.date.toISOString(),
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
    mood: entry.mood || undefined,
    moodColor: entry.moodColor || undefined,
  };
}

export async function createEntry(date: string, content: string) {
  const mood = await analyzeMood(content);

  const entry = await prisma.diaryEntry.create({
    data: {
      date: new Date(date),
      content,
      mood,
      moodColor: MOOD_COLORS[mood],
    },
  });

  revalidatePath('/');
  return entry;
}

export async function updateEntry(id: string, date: string, content: string) {
  const mood = await analyzeMood(content);

  const entry = await prisma.diaryEntry.update({
    where: { id },
    data: {
      date: new Date(date),
      content,
      mood,
      moodColor: MOOD_COLORS[mood],
    },
  });

  revalidatePath('/');
  revalidatePath(`/${id}`);
  return entry;
}

export async function deleteEntry(id: string) {
  await prisma.diaryEntry.delete({
    where: { id },
  });

  revalidatePath('/');
}
