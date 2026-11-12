# My Todo (Next.js + Supabase)

이전 과정에서 만든 Todo 리스트를 Next.js로 옮기고, 회원가입 / 로그인을 붙여서 **회원 전용 Todo**로 만들었습니다.

- 배포 주소: (Vercel 배포 후 추가)

## 기술

- Next.js 16 (App Router, Server Actions, Proxy)
- Supabase (Auth + PostgreSQL, RLS)
- Tailwind CSS, shadcn/ui, Tiptap 에디터

## 기능

| 기능 | 설명 |
|---|---|
| 회원가입 / 로그인 / 로그아웃 | Supabase Auth, 가입 시 `profiles`에 이름 저장 |
| 접근 제어 | 로그인 안 하면 `/`, `/todo/*` 접근 시 로그인 페이지로 이동 (`proxy.ts`) |
| 할일 등록 | 제목 + 에디터 내용, 빈 값이면 오류 메시지 |
| 목록 / 필터 | 전체 / 대기 / 진행중 / 완료 (`/?status=DONE`) |
| 상세 | 동적 라우트 `/todo/[id]` |
| 수정 | `/todo/[id]/edit`, 등록 폼 재사용 |
| 상태 변경 | 목록, 상세에서 select로 바로 변경 |
| 삭제 | `deleted_at` 기록 (소프트 삭제) |

## 폴더 구조

```
app/(todo)/
  page.tsx              목록 (서버 컴포넌트)
  loading.tsx           로딩 화면
  error.tsx             오류 화면
  sign_in, sign_up      로그인 / 회원가입
  todo/new              등록
  todo/[id]             상세 (+ not-found.tsx)
  todo/[id]/edit        수정
domains/
  auth/                 로그인 관련 액션, 컴포넌트, 쿼리
  todo/                 할일 관련 액션, 컴포넌트, 쿼리
shared/                 공통 컴포넌트, Supabase 연결
proxy.ts                로그인 확인 후 리다이렉트
supabase/schema.sql     테이블 + RLS
```

## 서버 / 클라이언트 컴포넌트 구분

- **서버 컴포넌트**: 목록(`TodoDashBoard`), 상세 페이지, 헤더
  → 서버에서 바로 DB를 조회해서 HTML로 보내기 때문에 첫 화면이 빠르고, 키가 브라우저에 노출되지 않음
- **클라이언트 컴포넌트**: 입력 폼, 상태 select, 삭제 버튼, 에디터
  → 사용자 입력이나 클릭 이벤트가 필요한 부분만 `'use client'`
- 필터는 주소의 `?status=`로 처리해서 새로고침하거나 링크를 공유해도 같은 화면이 나옴

## 상태별 화면

- 로딩: `loading.tsx` (스켈레톤)
- 오류: `error.tsx` (다시 시도 버튼)
- 빈 데이터: "아직 등록한 할일이 없습니다" / 필터별 안내
- 없는 할일: `not-found.tsx`

## 실행 방법

1. Supabase SQL Editor에서 `supabase/schema.sql` 실행
2. `.env.example`을 복사해서 `.env.local` 만들고 URL, Publishable key 입력
3. 실행

```bash
npm install
npm run dev
```
