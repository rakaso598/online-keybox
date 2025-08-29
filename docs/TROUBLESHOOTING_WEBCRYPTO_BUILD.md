# 트러블슈팅: Web Crypto API 빌드 에러 (Next.js, Vercel)

## 왜? (문제의 원인)
- Web Crypto API(`window.crypto.subtle`)는 브라우저(클라이언트)에서만 동작합니다.
- Next.js(특히 App Router)에서 암호화/복호화 유틸을 export/import하거나, 서버 코드에서 사용하면 서버 빌드 시점에 타입 에러가 발생합니다.
- 대표 에러: `Type 'Uint8Array<ArrayBufferLike>' is not assignable to type 'BufferSource'.` 등

## 무엇을? (문제 증상)
- `npm run build` 또는 Vercel 배포 시 타입 에러로 빌드 실패
- Web Crypto API 관련 코드가 서버에서 평가될 때 타입 불일치 발생
- `window is not defined` 등 런타임 에러도 발생할 수 있음

## 어떻게? (해결 방법)
- 암호화/복호화 함수는 반드시 `use client`가 선언된 컴포넌트 내부에서만 정의/사용
- Web Crypto API의 salt, iv 파라미터에는 항상 `.buffer`(ArrayBuffer)를 넘김
- export/import 하지 않고, 컴포넌트 함수 내부에서만 선언
- 서버 코드, API 라우트, getServerSideProps 등에서는 절대 사용하지 않음
- 타입 에러가 발생하면 `as Uint8Array`, `.buffer`, `as ArrayBuffer` 등으로 명시적 캐스팅

---

> 이 문서는 Next.js/Vercel 환경에서 Web Crypto API 빌드 에러를 해결한 과정을 정리한 문서입니다.
