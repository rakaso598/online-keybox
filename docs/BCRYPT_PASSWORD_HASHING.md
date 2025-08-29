# 박스 비밀번호 bcrypt 해싱 적용 내역

## 목적
- 사용자가 설정하는 박스 비밀번호(암호)를 저장하기 위해 bcrypt 해싱을 적용함
- 해싱된 비밀번호는 복원 불가, 비교만 가능

## 적용 방식
- **비밀번호 저장**: 서버(API)에서 bcrypt로 해싱 후 DB에 저장
- **비밀번호 확인**: 사용자가 입력한 평문 비밀번호를 서버에서 bcrypt 해시와 비교
- **클라이언트**: 평문 비밀번호를 직접 비교하지 않음, 서버에 검증 요청만 보냄

## 주요 코드
### 1. 비밀번호 해싱 및 저장 (PUT /api/boxes)
```ts
import bcrypt from 'bcryptjs';
// ...
if (password && (!existingBox.isUsed || (isUsed && password !== '***'))) {
  passwordToSave = await bcrypt.hash(password, 10);
}
```

### 2. 비밀번호 검증 (POST /api/boxes/verify)
```ts
const isMatch = await bcrypt.compare(password, box.password);
if (isMatch) { /* 인증 성공 */ }
```

### 3. 클라이언트에서의 암호 확인
```ts
const response = await fetch('/api/boxes/verify', { method: 'POST', ... });
if (response.ok) { /* 인증 성공 */ }
```

## 보안 한계
- 박스 내부의 내용(메모, 개인키 등)은 평문으로 저장됨 (암호화 미적용)
- 인증/인가, 키 관리, 내용 암호화 등은 미구현
- 진짜 민감한 정보는 저장하지 말 것

---

> bcrypt 해싱은 비밀번호 보호의 최소 기준입니다. 내용 보호에는 별도의 암호화가 필요합니다.
