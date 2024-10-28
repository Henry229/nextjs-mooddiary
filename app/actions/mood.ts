// app/actions/mood.ts
'use server';

import OpenAI from 'openai';
import { MoodType } from '@/types/diaryType';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function isValidMood(mood: string): mood is MoodType {
  return ['행복', '슬픔', '분노', '평범', '신남'].includes(mood);
}

function extractMood(text: string): MoodType {
  const normalizedText = text.trim().toLowerCase();
  const moods: MoodType[] = ['행복', '슬픔', '분노', '평범', '신남'];

  for (const mood of moods) {
    if (normalizedText.includes(mood)) {
      return mood;
    }
  }
  return '평범';
}

export async function analyzeMood(content: string): Promise<MoodType> {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            '당신은 텍스트의 감정을 분석하는 전문가입니다. 다음 감정 중 하나만 선택하세요: 행복, 슬픔, 분노, 평범, 신남. 감정 단어만 답변해주세요.',
        },
        {
          role: 'user',
          content: `다음 텍스트의 감정을 분석해주세요: "${content}"`,
        },
      ],
      model: 'gpt-3.5-turbo',
      max_tokens: 50,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content?.trim() || '평범';
    console.log('GPT Response:', response);

    const mood = extractMood(response);
    console.log('Extracted Mood:', mood);

    if (isValidMood(mood)) {
      return mood;
    }

    console.log('Invalid mood, defaulting to 평범');
    return '평범';
  } catch (error) {
    console.error('감정 분석 중 오류 발생:', error);
    return '평범';
  }
}
