---
task: "003"
title: 공통 레이아웃 및 네비게이션 골격 구성
status: pending
---

## 개요

주최자용 보호 레이아웃과 참여자용 공개 레이아웃의 골격을 구성합니다.
더미 데이터와 카피를 사용해 UI 구조를 먼저 잡고, 실제 데이터 연결은 Phase 3에서 수행합니다.
랜딩 페이지와 주최자 대시보드도 서비스 콘셉트에 맞는 구조로 교체합니다.

## 관련 파일

- `app/protected/layout.tsx` — 이벤트 관리 사이드 네비게이션/브레드크럼 골격 추가
- `app/e/[share_token]/layout.tsx` — 신규 생성: 참여자용 공개 레이아웃 (이벤트 정보 헤더 + 공지 탭)
- `app/page.tsx` — 랜딩 페이지: 서비스 소개 섹션 구조 + 더미 카피
- `app/protected/page.tsx` — 주최자 대시보드: 이벤트 목록 영역 placeholder 배치

## 구현 단계

- [ ] 1단계: `app/protected/layout.tsx` 수정 — 상단 네비게이션에 "이벤트 관리" 링크 및 서비스명 변경, 스타터 전용 컴포넌트(`DeployButton`, 튜토리얼 링크 등) 제거
- [ ] 2단계: `app/e/[share_token]/layout.tsx` 생성 — 이벤트 공개 영역을 위한 심플 레이아웃 (헤더에 서비스명, 이벤트명 자리, 공지 탭 링크 포함)
- [ ] 3단계: `app/page.tsx` 수정 — 히어로 섹션(서비스명/슬로건/CTA 버튼), 핵심 가치 3가지 섹션 구조로 교체 (더미 텍스트 사용, 스타터 전용 컴포넌트 제거)
- [ ] 4단계: `app/protected/page.tsx` 수정 — "내 이벤트" 영역 placeholder(빈 상태 메시지 + "이벤트 만들기" 버튼)로 교체

## 수락 기준

- `/` 랜딩 페이지에 서비스 소개 구조(히어로, 가치 섹션, CTA)가 표시됨
- `/protected` 대시보드에 이벤트 목록 영역 placeholder가 표시됨
- `/protected/*` 경로에서 스타터 전용 컴포넌트(DeployButton, Connect Supabase Steps 등)가 노출되지 않음
- `/e/[share_token]` 경로에서 참여자용 레이아웃이 적용됨 (탭 네비게이션 포함)
- 라이트/다크 테마 모두 레이아웃 깨짐 없음
- 빌드 오류 및 TypeScript 타입 오류 없음
