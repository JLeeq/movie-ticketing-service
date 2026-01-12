# 영화 예매 서비스

React + TypeScript + Vite + Express + Supabase를 사용한 영화 예매 서비스입니다.

## 프로젝트 구조

```
movie/
├── client/          # React 프론트엔드
├── server/          # Express 백엔드
└── package.json     # 루트 패키지 (개발 스크립트)
```

## 시작하기

### 1. 의존성 설치

```bash
npm run install:all
```

또는 각각 설치:

```bash
# 루트
npm install

# 클라이언트
cd client && npm install

# 서버
cd server && npm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 참고하여 `.env` 파일을 생성하세요.

**client/.env:**
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**server/.env:**
```
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

### 3. 개발 서버 실행

프론트엔드와 백엔드를 동시에 실행:

```bash
npm run dev
```

또는 각각 실행:

```bash
# 프론트엔드 (포트 3000)
npm run dev:client

# 백엔드 (포트 5000)
npm run dev:server
```

## 주요 기능

- ✅ 영화 목록 화면 (가로 스크롤, 4개씩 표시)
- ✅ 영화 상세 및 날짜 선택
- ✅ 상영 스케줄 선택
- ✅ 좌석 선택 (A1-G8)
- ✅ 결제 완료 팝업

## 다음 단계

- [ ] Supabase 연동
- [ ] 로그인/회원가입 기능
- [ ] 실제 데이터베이스 연동
- [ ] 좌석 예매 동시성 처리
- [ ] 예매 내역 조회

