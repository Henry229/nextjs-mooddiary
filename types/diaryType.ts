export type MoodType = '행복' | '슬픔' | '분노' | '평범' | '신남';

export interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  mood?: MoodType; // 감정 상태
  moodColor?: string; // 감정에 따른 색상
}
