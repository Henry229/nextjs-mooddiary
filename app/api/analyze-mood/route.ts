// import { OpenAI } from 'openai';
// import { MoodType } from '@/types/diaryType';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // 감정 단어만 추출하는 함수
// function extractMood(text: string): MoodType {
//   const moods: MoodType[] = ['행복', '슬픔', '분노', '평범', '신남'];
//   for (const mood of moods) {
//     if (text.includes(mood)) {
//       return mood;
//     }
//   }
//   return '평범';
// }

// export async function POST(request: Request) {
//   try {
//     const { content } = await request.json();

//     const completion = await openai.chat.completions.create({
//       messages: [
//         {
//           role: 'system',
//           content:
//             '당신은 텍스트의 감정을 분석하는 전문가입니다. 다음 감정 중 하나만 선택해야 합니다: 행복, 슬픔, 분노, 평범, 신남. 감정 단어만 답변하세요.',
//         },
//         {
//           role: 'user',
//           content: `다음 텍스트의 감정을 분석해주세요: "${content}"`,
//         },
//       ],
//       model: 'gpt-3.5-turbo',
//       max_tokens: 50,
//       temperature: 0.7,
//     });

//     const response = completion.choices[0].message.content?.trim() || '평범';
//     const mood = extractMood(response);

//     return Response.json({ mood });
//   } catch (error) {
//     console.error('GPT API 호출 중 오류:', error);
//     return Response.json({ mood: '평범' });
//   }
// }
