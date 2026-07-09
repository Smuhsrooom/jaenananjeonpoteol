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

1. [vercel.com](https://vercel.com) → GitHub 저장소 import  
   `Smuhsrooom/jaenananjeonpoteol`
2. **Framework Preset:** Other  
3. 루트 설정은 `vercel.json` 사용 (수정 불필요)
4. **Environment Variables** 추가:
   - `KMA_APIHUB_AUTH_KEY` = 기상청 API허브 인증키
   - `DATA_GO_KR_SERVICE_KEY` = 공공데이터포털 키 (선택)
5. Deploy

CLI로 배포:

```bash
npx vercel login
npx vercel          # 미리보기
npx vercel --prod   # 프로덕션
```

### 참고

- 로컬: Vite 플러그인이 `/api/*` 프록시
- Vercel: `api/` 서버리스 함수가 동일 엔드포인트 제공
- `.env` 는 git에 올리지 않음 → Vercel 대시보드에 키 등록 필수
