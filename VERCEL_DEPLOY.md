# Vercel 배포 가이드

## 배포 주소
`https://movie-ticketing-service-8v5liqrcc-jleeqs-projects.vercel.app`

## 환경 변수 설정 (Vercel 대시보드)

1. Vercel 프로젝트 → Settings → Environment Variables
2. 다음 환경 변수 추가:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**중요:** Production, Preview, Development 모두에 추가하세요.

## Supabase 설정 (필수)

### Redirect URL 추가

1. Supabase 대시보드 → Authentication → URL Configuration
2. Redirect URLs에 추가:

```
https://movie-ticketing-service-8v5liqrcc-jleeqs-projects.vercel.app
https://movie-ticketing-service-8v5liqrcc-jleeqs-projects.vercel.app/**
```

### Site URL 설정

Site URL도 다음으로 설정:
```
https://movie-ticketing-service-8v5liqrcc-jleeqs-projects.vercel.app
```

## 확인 사항

- [ ] Vercel 환경 변수 설정 완료
- [ ] Supabase Redirect URL 추가 완료
- [ ] Supabase Site URL 설정 완료
- [ ] 환경 변수 변경 후 재배포 (자동 또는 수동)

## 문제 해결

### 로그인이 안 될 때
- Supabase Redirect URL에 Vercel 도메인이 추가되어 있는지 확인
- Vercel 환경 변수가 올바르게 설정되었는지 확인
- 브라우저 콘솔에서 에러 확인

### 환경 변수가 적용되지 않을 때
- 환경 변수 변경 후 재배포 필요
- Production, Preview, Development 모두에 설정했는지 확인


