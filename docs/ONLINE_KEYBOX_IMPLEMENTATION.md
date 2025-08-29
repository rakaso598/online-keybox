# 온라인 키박스(Online Keybox) 구현 내역

## 1. 프로젝트 개요
- **기술스택**: Next.js 15, TypeScript, TailwindCSS, Prisma, PostgreSQL(Neon), Vercel
- **주요 목적**: 임시 온라인 개인 문자열 보관함(키박스) 구현 및 서버리스 환경에서의 데이터베이스 연동 학습

## 2. 데이터베이스 및 Prisma
- **Prisma ORM**을 사용하여 PostgreSQL과 연동
- `.env` 파일의 `DATABASE_URL` 환경변수로 DB 연결
- Prisma 스키마(`prisma/schema.prisma`):

```prisma
model Box {
  id        String   @id @default(cuid())
  boxNumber Int      @unique // 1~5 박스 번호
  title     String   @default("")
  content   String   @default("")
  password  String   @default("")
  isUsed    Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@map("boxes")
}
```
- 마이그레이션 및 Prisma Client 생성:
  - `npx prisma migrate dev --name init`
  - `npx prisma generate`

## 3. API 라우트
- `app/api/boxes/route.ts`에서 RESTful API 구현
  - **GET**: 모든 박스 조회(없으면 5개 초기화)
  - **PUT**: 박스 정보(제목, 내용, 암호, 사용여부) 수정
  - **DELETE**: 박스 초기화(내용, 암호, 사용여부 리셋)

## 4. 프론트엔드 구조
- **컴포넌트 분리**
  - `BoxGrid`: 박스 목록 및 상태 표시
  - `BoxModal`: 박스 내부(제목/내용/수정/삭제/저장) 모달
  - `PasswordModal`: 암호 설정/입력 모달
- **상태 관리**: useState, useEffect로 API 연동 및 로딩/에러 처리
- **API 연동**: localStorage 대신 fetch로 `/api/boxes` 호출
- **UX**: 저장 전 이탈 시 경고, 저장 후 알림 없음, 반응형 UI

## 5. 주요 파일 구조
```
app/
  components/
    BoxGrid.tsx
    BoxModal.tsx
    PasswordModal.tsx
  lib/
    prisma.ts
  api/
    boxes/route.ts
  page.tsx
prisma/
  schema.prisma
.env
```

## 6. 배포 및 실행
- 개발: `npm run dev`
- 빌드: `npm run build`
- Vercel 배포: Vercel 대시보드에서 연결 후 배포

## 7. 보안 및 확장성
- **암호**: 박스별 개별 암호(서버 DB에 저장, 추후 해싱 권장)
- **확장성**: 사용자 인증 추가 시, 사용자별 박스 관리 가능
- **서버리스**: Vercel 환경에서 Prisma Serverless 지원

---

> 본 문서는 2025년 8월 기준 온라인 키박스 프로젝트의 전체 구현 내역을 정리한 문서입니다.
