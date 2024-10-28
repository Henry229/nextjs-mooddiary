import { MoodType } from '@/types/diaryType';
import { Smile, Frown, Angry, Meh, PartyPopper } from 'lucide-react';

export const MOOD_COLORS = {
  행복: '#FFD700',
  슬픔: '#1E90FF',
  분노: '#FF4500',
  평범: '#C0C0C0',
  신남: '#7FFF00',
} as const;

export const MOOD_ICONS = {
  행복: Smile,
  슬픔: Frown,
  분노: Angry,
  평범: Meh,
  신남: PartyPopper,
} as const;

export async function analyzeMood(content: string): Promise<MoodType> {
  try {
    const response = await fetch('/api/analyze-mood', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    const data = await response.json();
    console.log('1111-----> data from gpt: ', data);
    return data.mood;
  } catch (error) {
    console.error('감정 분석 중 오류 발생:', error);
    return '평범';
  }
}
