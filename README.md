# 국가 재난안전센터 (jaenananjeonpoteol)

백두산 화산재 대비 · 시민 안내 포털  
기상청 API허브 실시간 지진·화산 연동

## 구조

```
api/                              # Vercel 서버리스 (지진·화산)
artifacts/disaster-safety-portal/ # Vite React 프론트
scripts/vercel-build.mjs          # Vercel 빌드 진입점
```

## 로컬 실행

```bash
npx pnpm install

# 프로젝트 루트 .env
# KMA_APIHUB_AUTH_KEY=기상청_API허브_키
# DATA_GO_KR_SERVICE_KEY=공공데이터포털_키(선택)

npx pnpm dev
```

http://localhost:5173/

## 페이지

| 경로 | 내용 |
|------|------|
| `/` | 현황 · 지도 |
| `/definition` | 재난 정의 |
| `/system` | 관리 체계 |
| `/alerts` | 위기경보 4단계 |
| `/guidelines` | 행동요령 |
| `/impact` | 영향 브리핑 |
| `/live` | 실시간 화산·지진 |
| `/contacts` | 비상 연락처 |

## Vercel 배포

1. 저장소 루트에서 import
2. Root Directory 비움 (`.`)
3. Framework: Other — `vercel.json` 따름
4. Environment Variables
   - `KMA_APIHUB_AUTH_KEY`
   - `DATA_GO_KR_SERVICE_KEY` (선택)
5. Deploy

- 로컬: Vite `kmaPublicApiPlugin`이 `/api/*` 처리
- Vercel: 루트 `api/` 서버리스
- `.env`는 git 제외 → Vercel에 키 등록 필수
