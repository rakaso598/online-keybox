# 온라인 키박스(Online Keybox) 트러블슈팅 가이드

## 1. Vercel 빌드 에러: Web Crypto API 관련 타입/런타임 에러
### 증상
- Vercel 빌드 시 `Type error: No overload matches this call. ... Type 'Uint8Array<ArrayBufferLike>' is not assignable to type 'BufferSource'.` 등 Web Crypto API 관련 에러 발생
- 또는 `window is not defined` 등 런타임 에러

### 원인
- Web Crypto API(`window.crypto.subtle`)는 브라우저(클라이언트)에서만 동작
- 암호화/복호화 유틸이 export/import되어 서버 빌드 시점에 평가될 경우 타입 에러 발생

### 해결 방법
- 암호화/복호화 함수는 반드시 `use client`가 선언된 컴포넌트 내부에서만 정의/사용
- export/import 하지 않고, 컴포넌트 함수 내부에서만 선언
- 서버 코드, API 라우트, getServerSideProps 등에서는 절대 사용하지 않음

---

## 2. pnpm-lock.yaml 관련 에러
### 증상
- `ERR_PNPM_OUTDATED_LOCKFILE` 또는 lockfile 불일치로 빌드 실패

### 해결 방법
- 로컬에서 `pnpm install` 또는 `pnpm install --no-frozen-lockfile` 실행 후, lock 파일을 git에 커밋
- Vercel에 다시 푸시/배포

---

## 3. 기타
- Prisma 마이그레이션, .env 설정, DB 연결 등은 [docs/ONLINE_KEYBOX_IMPLEMENTATION.md](./ONLINE_KEYBOX_IMPLEMENTATION.md) 참고

---

> 이 문서는 온라인 키박스 프로젝트의 주요 트러블슈팅 사례와 해결법을 정리한 문서입니다.
