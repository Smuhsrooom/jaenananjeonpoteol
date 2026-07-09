# 국가 재난안전센터 (jaenananjeonpoteol)

백두산 화산재 대비 · 시민 안내 포털  
기상청 API허브 실시간 지진·화산 연동

## 로컬 실행

```bash
# 의존성
pnpm install
# 또는
npx pnpm install

# 환경변수 (프로젝트 루트 .env)
# KMA_APIHUB_AUTH_KEY=기상청_API허브_키
# DATA_GO_KR_SERVICE_KEY=공공데이터포털_키(선택)

# 프론트 개발 서버
npx pnpm --filter @workspace/disaster-safety-portal dev
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

### 권장 설정 (저장소 루트)

1. [vercel.com](https://vercel.com) → `Smuhsrooom/jaenananjeonpoteol` import
2. **Root Directory:** 비워 두기 (`.` 저장소 루트)
3. **Framework Preset:** Other
4. **Build & Output** (대시보드에 값이 있으면 지우고 vercel.json 따르기)
   - Install: `pnpm install`
   - Build: `pnpm --filter @workspace/disaster-safety-portal run build`
   - Output Directory: `artifacts/disaster-safety-portal/dist`
5. **Environment Variables**
   - `KMA_APIHUB_AUTH_KEY` = 기상청 API허브 키
   - `DATA_GO_KR_SERVICE_KEY` = 공공데이터 키 (선택)
6. Deploy → 실패 시 **Redeploy**

### "No Output Directory named public" 해결

대시보드 **Output Directory** 가 `public` 으로 되어 있으면 지우고  
`artifacts/disaster-safety-portal/dist` 로 바꾸거나 비운 뒤 `vercel.json` 을 사용하세요.

### 참고

- 로컬: Vite 플러그인이 `/api/*` 프록시
- Vercel: 루트 `api/` 서버리스 함수
- `.env` 는 git 제외 → Vercel에 키 등록 필수
