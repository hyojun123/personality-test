# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

동물 성격 테스트 웹 앱 - 30개의 질문을 통해 사용자의 성격을 20가지 동물 유형 중 하나로 분석

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Deployment**: Vercel
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## 개발 명령어

```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 실행 (localhost:3000)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 실행
```

## 아키텍처

### 페이지 흐름
`/` (시작) → `/test` (30문항 진행) → `/result` (동물 유형 결과)

### 핵심 로직
- **질문 데이터** (`/data/questions.ts`): 6가지 성격 차원별 5문항씩 총 30문항
- **동물 데이터** (`/data/animals.ts`): 20가지 동물 유형과 각 유형의 성격 차원 점수
- **결과 계산** (`/lib/calculateResult.ts`): 응답(1-5점)을 6차원 점수로 변환 후 가장 유사한 동물 매칭

### 성격 차원 (6가지)
외향성/내향성, 감정적/논리적, 계획형/즉흥형, 리더형/협력형, 안정추구/모험추구, 독립형/의존형
