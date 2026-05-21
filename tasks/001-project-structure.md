---
task: "001"
title: 프로젝트 구조 및 라우팅 설정
status: done
---

## 개요

Next.js App Router 기반 전체 라우트 구조를 생성합니다.
모든 주요 페이지의 빈 껍데기 파일을 생성하고,
모바일 사용자용 하단 내비게이션 레이아웃과 관리자용 사이드바 레이아웃을 구성합니다.

## 관련 파일

- `app/page.tsx` — 랜딩 페이지
- `app/invite/[invite_code]/page.tsx` — 초대 링크 참여 페이지 (공개)
- `app/invite/[invite_code]/layout.tsx` — 초대 공개 레이아웃
- `app/protected/layout.tsx` — 사용자용 모바일 레이아웃 (하단 내비게이션)
- `app/protected/events/page.tsx` — 내 이벤트 목록
- `app/protected/events/new/page.tsx` — 이벤트 생성
- `app/protected/events/[id]/page.tsx` — 이벤트 상세
- `app/protected/events/[id]/edit/page.tsx` — 이벤트 수정
- `app/protected/profile/page.tsx` — 사용자 프로필 (기존)
- `app/admin/layout.tsx` — 관리자 데스크톱 사이드바 레이아웃
- `app/admin/page.tsx` — 관리자 대시보드
- `app/admin/events/page.tsx` — 이벤트 관리 테이블
- `app/admin/users/page.tsx` — 사용자 관리 테이블
- `app/admin/stats/page.tsx` — 통계 분석
- `lib/supabase/proxy.ts` — `/invite/` 경로 공개 허용

## 구현 단계

- [x] 1단계: `/invite/[invite_code]` 공개 라우트 및 레이아웃 생성
- [x] 2단계: `/protected/events` 관련 라우트 생성 (목록/생성/상세/수정)
- [x] 3단계: `/admin` 관련 라우트 생성 (대시보드/이벤트/사용자/통계)
- [x] 4단계: `app/protected/layout.tsx` 모바일 하단 내비게이션 바 구성
- [x] 5단계: `app/admin/layout.tsx` 데스크톱 사이드바 레이아웃 구성
- [x] 6단계: `app/page.tsx` Gather 랜딩 페이지로 교체
- [x] 7단계: `lib/supabase/proxy.ts` `/invite/` 화이트리스트 추가

## 수락 기준

- 13개 주요 페이지 라우트가 404 없이 접근 가능
- `/invite/임의값` 비로그인 접근 시 로그인 리다이렉트 없이 페이지 렌더링
- `/protected/*` 비로그인 접근 시 `/auth/login`으로 리다이렉트
- `/admin/*` 경로에서 사이드바 레이아웃 표시
- `/protected/*` 경로에서 모바일 하단 내비게이션 표시
- 빌드 오류 및 TypeScript 타입 오류 없음
