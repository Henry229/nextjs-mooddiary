# .cursorrules

```
# 규칙

## 패키지 매니저
- **패키지 매니저**: `npm`을 사용합니다.

## UI 컴포넌트 생성
- **ShadCN 컴포넌트를 우선적으로 활용합니다.**
- **ShadCN 컴포넌트 추가 명령어**:
  - CLI 명령어 예시: `npx shadcn@latest add button`

# Next.js Server Actions & API Routes 사용 지침

이 지침은 **Next.js** 프로젝트에서 **Server Actions**와 **API Routes**를 어떻게 적절히 사용할지에 대한 안내입니다.

## Next.js Server Actions
- **Next.js Server Actions**는 **간단한 데이터 작업** 또는 **기본 CRUD** 작업에 사용합니다. 이 기능은 컴포넌트 내에서 서버 작업을 직접 처리할 수 있어 추가적인 API 엔드포인트가 필요 없습니다.
- 복잡한 비즈니스 로직이나 외부 API 호출, 또는 다단계 처리가 필요하지 않은 경우에 Server Actions를 사용합니다.
- 예시:
  - 사용자별 데이터를 페이지에 로드.
  - 간단한 폼 처리 (예: 새로운 항목 추가, 좋아요 버튼 클릭 처리).

## Next.js API Routes
- **Next.js API Routes**는 **복잡한 비즈니스 로직**이나 **외부 API 통신**, **세션 관리** 등의 작업에 사용합니다.
  - 인증, 권한 관리, 또는 트랜잭션 같은 중요한 작업에서 API Routes를 사용하여 처리 흐름을 더 명확하게 관리할 수 있습니다.
  - 외부 서비스와의 통합이나 다단계 프로세스가 필요한 경우 적합합니다.
- 예시:
  - 결제 처리, 주문 관리, 외부 API 호출 등 복잡한 작업.
  - 사용자 인증 및 권한 관리가 필요한 API 엔드포인트.

## 일반 규칙
- **Next.js** 프로젝트에서 간단한 데이터 처리는 **Server Actions**를 사용하여 성능 최적화와 코드 간결성을 유지합니다.
- 복잡한 로직, 확장성, 또는 외부 API 통합이 필요한 경우 **API Routes**를 사용합니다.
```

# .eslintrc.json

```json
{
  "extends": ["next/core-web-vitals", "next/typescript"]
}

```

# .gitignore

```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

```

# app\[id]\page.tsx

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Pencil, Trash2, Meh } from 'lucide-react';
import { getEntryById, deleteEntry } from '@/lib/diary';
import { MOOD_ICONS } from '@/lib/mood';
import type { MoodType } from '@/types/diaryType';
import Link from 'next/link';

export default function DiaryDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const entry = getEntryById(params.id);

  if (!entry) {
    return <div>일기를 찾을 수 없습니다.</div>;
  }

  // 타입 안전성을 위한 처리
  const mood = (entry.mood || '평범') as MoodType;
  const MoodIcon = MOOD_ICONS[mood] || Meh;

  const handleDelete = () => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      deleteEntry(params.id);
      router.push('/');
    }
  };

  return (
    <div className='container mx-auto py-8'>
      <Card
        style={{
          backgroundColor: entry.moodColor ? `${entry.moodColor}20` : undefined,
          borderColor: entry.moodColor ? entry.moodColor : undefined,
        }}
      >
        <CardHeader className='flex flex-row justify-between items-center'>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <span>{new Date(entry.date).toLocaleDateString('ko-KR')}</span>
            <div className='flex items-center gap-1'>
              <MoodIcon
                className='h-5 w-5'
                style={{ color: entry.moodColor }}
              />
              <span style={{ color: entry.moodColor }}>
                {entry.mood || '평범'}
              </span>
            </div>
          </div>
          <div className='flex gap-2'>
            <Link href={`/edit/${params.id}`}>
              <Button variant='outline' size='icon'>
                <Pencil className='h-4 w-4' />
              </Button>
            </Link>
            <Button variant='destructive' size='icon' onClick={handleDelete}>
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className='whitespace-pre-wrap'>{entry.content}</p>
        </CardContent>
      </Card>
    </div>
  );
}

```

# app\api\analyze-mood\route.ts

```ts
import { OpenAI } from 'openai';
import { MoodType } from '@/types/diaryType';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 감정 단어만 추출하는 함수
function extractMood(text: string): MoodType {
  const moods: MoodType[] = ['행복', '슬픔', '분노', '평범', '신남'];
  for (const mood of moods) {
    if (text.includes(mood)) {
      return mood;
    }
  }
  return '평범';
}

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            '당신은 텍스트의 감정을 분석하는 전문가입니다. 다음 감정 중 하나만 선택해야 합니다: 행복, 슬픔, 분노, 평범, 신남. 감정 단어만 답변하세요.',
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
    const mood = extractMood(response);

    return Response.json({ mood });
  } catch (error) {
    console.error('GPT API 호출 중 오류:', error);
    return Response.json({ mood: '평범' });
  }
}

```

# app\edit\[id]\page.tsx

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { getEntryById, updateEntry } from '@/lib/diary';
import { useState, useEffect } from 'react';

export default function EditDiary({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [date, setDate] = useState<Date>(new Date());
  const [content, setContent] = useState('');

  useEffect(() => {
    const entry = getEntryById(params.id);
    if (entry) {
      setDate(new Date(entry.date));
      setContent(entry.content);
    }
  }, [params.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !content.trim()) return;

    updateEntry(params.id, date.toISOString(), content.trim());
    router.push(`/`);
  };

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-3xl font-bold mb-6'>일기 수정</h1>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <Calendar
            mode='single'
            selected={date}
            onSelect={(date) => setDate(date || new Date())}
            className='rounded-md border'
          />
        </div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='일기 내용을 수정해주세요...'
          className='min-h-[300px]'
        />
        <div className='flex justify-end gap-4'>
          <Button type='button' variant='outline' onClick={() => router.back()}>
            취소
          </Button>
          <Button type='submit'>저장</Button>
        </div>
      </form>
    </div>
  );
}

```

# app\favicon.ico

This is a binary file of the type: Binary

# app\fonts\GeistMonoVF.woff

This is a binary file of the type: Binary

# app\fonts\GeistVF.woff

This is a binary file of the type: Binary

# app\globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: Arial, Helvetica, sans-serif;
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

```

# app\layout.tsx

```tsx
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Link from 'next/link';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <h1 className='text-3xl font-bold p-4'>
          <Link href='/'>나의 일기장</Link>
        </h1>
        {children}
      </body>
    </html>
  );
}

```

# app\new\page.tsx

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createEntry } from '@/lib/diary';
import { useState } from 'react';

export default function NewDiary() {
  const router = useRouter();
  const [date, setDate] = useState<Date>(new Date());
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !content.trim()) return;

    createEntry(date.toISOString(), content.trim());
    router.push('/');
  };

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-3xl font-bold mb-6'>새 일기 작성</h1>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <Calendar
            mode='single'
            selected={date}
            onSelect={(date) => setDate(date || new Date())}
            className='rounded-md border'
          />
        </div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='오늘의 일기를 작성해주세요...'
          className='min-h-[300px]'
        />
        <div className='flex justify-end gap-4'>
          <Button type='button' variant='outline' onClick={() => router.back()}>
            취소
          </Button>
          <Button type='submit'>저장</Button>
        </div>
      </form>
    </div>
  );
}

```

# app\page.tsx

```tsx
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

```

# components.json

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

# components\DiaryList.tsx

```tsx
// components/DiaryList.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getAllEntries } from '@/lib/diary';
import type { DiaryEntry, MoodType } from '@/types/diaryType';
import { MOOD_ICONS } from '@/lib/mood';
import { Meh } from 'lucide-react';

export default function DiaryList() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    setEntries(getAllEntries());
  }, []);

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {entries.map((entry) => {
        // 타입 안전성을 위한 처리
        const mood = (entry.mood || '평범') as MoodType;
        const MoodIcon = MOOD_ICONS[mood] || Meh;

        return (
          <Link key={entry.id} href={`/${entry.id}`}>
            <Card
              className='hover:bg-accent transition-colors'
              style={{
                backgroundColor: entry.moodColor
                  ? `${entry.moodColor}20`
                  : undefined,
                borderColor: entry.moodColor ? entry.moodColor : undefined,
              }}
            >
              <CardHeader className='flex flex-row justify-between items-center text-sm text-muted-foreground'>
                <span>{new Date(entry.date).toLocaleDateString('ko-KR')}</span>
                <MoodIcon
                  className='h-5 w-5'
                  style={{ color: entry.moodColor }}
                />
              </CardHeader>
              <CardContent>
                <p className='line-clamp-3'>{entry.content}</p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

```

# components\ui\button.tsx

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

```

# components\ui\calendar.tsx

```tsx
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

```

# components\ui\card.tsx

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

```

# components\ui\popover.tsx

```tsx
"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }

```

# components\ui\textarea.tsx

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }

```

# docs\PRD.md

```md
# MoodDiary 제품 요구사항 문서(PRD)

## 1. 프로젝트 개요

**MoodDiary**는 사용자가 일기를 작성하고, 해당 일기의 감정을 자동으로 분석하여 시각적으로 표시해주는 단순하고 직관적인 일기장 서비스입니다. GPT 기술을 활용하여 사용자의 일기 내용을 분석하고, 감정에 따라 색상과 아이콘을 통해 일기의 분위기를 한눈에 파악할 수 있습니다.

## 2. 유저 플로우

1. **일기 작성**

   - 메인 화면에서 **'새 일기 작성'** 버튼을 클릭합니다.
   - 제목과 내용 입력 필드가 제공되며, 사용자는 일기를 작성합니다.
   - 작성 완료 후 **'저장'** 버튼을 누릅니다.

2. **감정 분석**

   - 일기가 저장되면 **OpenAI GPT API**를 활용하여 내용의 감정을 분석합니다.
   - 분석된 감정은 로컬 스토리지나 상태 관리로 저장됩니다.

3. **일기 리스트 보기**

   - 사용자는 날짜별로 정렬된 일기 리스트를 확인합니다.
   - 각 일기에는 감정에 따른 색상 배경과 아이콘이 표시됩니다.

4. **일기 상세 보기**

   - 리스트에서 일기를 선택하면 상세 내용을 확인할 수 있습니다.
   - 상세 페이지에서도 감정 분석 결과가 표시됩니다.

## 3. 핵심 기능

### A. 일기 작성 및 관리

- **일기 작성**: 제목과 내용을 입력하여 새로운 일기를 작성합니다.
- **일기 수정 및 삭제**: 작성한 일기를 수정하거나 삭제할 수 있습니다.
- **일기 리스트뷰 제공**: 날짜별로 정렬된 일기 목록을 제공합니다.

### B. 감정 분석

- **GPT API 연동**: OpenAI GPT API를 사용하여 일기 내용을 감정 분석합니다.
- **감정 분류**: 분석된 감정을 사전에 정의된 감정 상태로 분류합니다.

### C. 시각적 표시

- **감정 상태에 따른 색상 및 아이콘 표시**

  감정 상태별로 다음과 같이 색상 코드와 아이콘을 매핑합니다:

  | 감정 상태 | 색상 코드      | 아이콘                                             |
  | --------- | -------------- | -------------------------------------------------- |
  | **행복**  | `#FFD700` 금색 | `Smile` 아이콘 (Lucide Icons의 `Smile` 사용)       |
  | **슬픔**  | `#1E90FF` 파랑 | `Frown` 아이콘 (Lucide Icons의 `Frown` 사용)       |
  | **분노**  | `#FF4500` 주황 | `Angry` 아이콘 (Lucide Icons의 `Angry` 사용)       |
  | **평범**  | `#C0C0C0` 은색 | `Meh` 아이콘 (Lucide Icons의 `Meh` 사용)           |
  | **신남**  | `#7FFF00` 연두 | `Surprise` 아이콘 (Lucide Icons의 `Surprise` 사용) |

- **아이콘 라이브러리 사용**

  - **Lucide Icons**를 사용하여 아이콘을 적용합니다.

- **일기 리스트 및 상세 페이지에서 적용**

  - 리스트뷰에서 각 일기는 감정에 따라 배경색과 아이콘이 표시됩니다.
  - 상세 페이지에서도 해당 감정의 색상과 아이콘이 표시되어 사용자가 일기의 분위기를 쉽게 파악할 수 있습니다.

## 4. 기술스택

### 필수 기술스택

- **Next.js App Router**: 서버 사이드 렌더링 및 라우팅 관리
- **ShadCN UI**: UI 컴포넌트 라이브러리
- **TailwindCSS**: 스타일링 프레임워크

### 추가 기술스택

- **TypeScript**: 정적 타입 체크를 통한 안정성 확보
- **React Hooks 및 Context API**: 상태 관리
- **OpenAI GPT API**: 감정 분석을 위한 GPT 모델 사용
- **로컬 스토리지(Local Storage)**: 일기 데이터의 로컬 저장
- **Axios 또는 Fetch API**: API 호출을 위한 HTTP 클라이언트
- **Lucide Icons**: 아이콘 사용을 위한 라이브러리
  - ShadCN UI와 호환되며 다양한 아이콘을 제공합니다.

## 5. MVP 기능 개발 이후 추가 개선사항

- **회원가입 및 로그인 기능**: 사용자 인증 기능 추가 (이메일 및 비밀번호 기반)
- **데이터베이스 연동**: Prisma와 PostgreSQL 등을 활용하여 데이터 영구 저장
- **다국어 지원**: 영어 등 다른 언어로도 일기 작성 및 감정 분석 가능하도록 확장
- **감정 통계 제공**: 월별 또는 연도별 감정 변화 추이 그래프 제공
- **소셜 기능**: 다른 사용자와 일기를 공유하거나 댓글을 남길 수 있는 기능
- **알림 기능**: 일기 작성 리마인더 알림 설정
- **커스터마이징**: 사용자별 테마 변경 및 아이콘 커스터마이징 기능
- **오프라인 모드 개선**: 인터넷 연결 없이도 일기 작성 및 확인 가능하도록 지원

```

# lib\diary.ts

```ts
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

```

# lib\mood.ts

```ts
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

```

# lib\utils.ts

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

```

# next-env.d.ts

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/building-your-application/configuring/typescript for more information.

```

# next.config.mjs

```mjs
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;

```

# package.json

```json
{
  "name": "nextjs-moondiary",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@radix-ui/react-popover": "^1.1.2",
    "@radix-ui/react-slot": "^1.1.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "lucide-react": "^0.453.0",
    "next": "14.2.16",
    "openai": "^4.68.4",
    "react": "^18",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18",
    "tailwind-merge": "^2.5.4",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.2.16",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}

```

# postcss.config.mjs

```mjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;

```

# README.md

```md
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```

# tailwind.config.ts

```ts
import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;

```

# tsconfig.json

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

```

# types\diaryType.ts

```ts
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

```

