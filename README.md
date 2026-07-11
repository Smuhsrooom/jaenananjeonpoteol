# 국가 재난안전센터 (National Disaster Safety Center)

> **백두산 화산재 대비 · 시민 안내 웹 포털**  
> 기상청 실시간 관측 연동 · 위기경보 · 행동요령 · 화산재 확산 시뮬레이션  
> 저장소: [Smuhsrooom/jaenananjeonpoteol](https://github.com/Smuhsrooom/jaenananjeonpoteol)

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [개발 배경 및 목적](#2-개발-배경-및-목적)
3. [주요 기능](#3-주요-기능)
4. [기술 스택](#4-기술-스택)
5. [시스템 아키텍처](#5-시스템-아키텍처)
6. [디렉터리 구조](#6-디렉터리-구조)
7. [페이지·라우트 명세](#7-페이지라우트-명세)
8. [데이터 연동 (기상청 API)](#8-데이터-연동-기상청-api)
9. [핵심 모듈 상세](#9-핵심-모듈-상세)
10. [UI·UX 설계](#10-uiux-설계)
11. [로컬 실행 방법](#11-로컬-실행-방법)
12. [배포 (Vercel)](#12-배포-vercel)
13. [환경 변수](#13-환경-변수)
14. [설계 결정 및 구현 이슈](#14-설계-결정-및-구현-이슈)
15. [한계 및 면책](#15-한계-및-면책)
16. [향후 개선 방향](#16-향후-개선-방향)
17. [참고 자료](#17-참고-자료)
18. [시연·제출 체크리스트](#18-시연제출-체크리스트)

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | 국가 재난안전센터 (jaenananjeonpoteol) |
| **형태** | 반응형 SPA 웹 애플리케이션 + 서버리스 API |
| **주제** | 백두산 화산재 재난 대비 시민 정보 포털 |
| **핵심 가치** | 공식·관측 기반 정보 제공, 가짜뉴스 대비, 행동 지침 명확화 |
| **패키지 매니저** | pnpm (모노레포 workspace) |
| **프론트엔드** | React 19 + TypeScript + Vite 7 + Tailwind CSS 4 |
| **백엔드** | Vercel Serverless Functions (Node.js CommonJS) |
| **지도** | Leaflet |
| **다국어** | 한국어 / 영어 (i18n) |
| **라이선스** | MIT |

본 시스템은 **백두산 화산 분화 시나리오를 가정한 시민 안내 포털**이다.  
기상청 API허브에서 수신한 **실제 지진·화산 관측 정보**를 표시하고, 행정안전부 위기경보 4단계에 따른 행동요령·영향 분석·비상 연락처를 제공한다.  
또한 계절별 주풍을 반영한 **교육용 화산재 확산 시뮬레이션**으로 도시·공항 도달 시간과 항공 영향을 시각화한다.

---

## 2. 개발 배경 및 목적

### 2.1 배경

- 백두산은 활화산이며, 과거 대규모 분화(약 946년 밀레니엄 대분화, 추정 VEI 7) 기록이 있다.
- 남한은 지리적으로 **직접 두꺼운 화산재 퇴적**보다 **항공·물류 등 간접 영향** 가능성이 크다.
- 2010년 아이슬란드 에이야프얄라요쿨 분화 사례처럼, 화산재는 **원거리에서도 항공 운항을 마비**시킬 수 있다.
- 재난 시 SNS·단톡 등 **출처 불명 정보**가 공포·사재기·잘못된 대피로 이어질 수 있다.

### 2.2 목적

1. **신뢰 가능한 정보 창구**: 기상청 관측·공식 안내 채널을 한곳에 모은다.
2. **단계별 행동 안내**: 위기경보(관심·주의·경계·심각)에 맞춘 시민 행동을 제시한다.
3. **실시간 관측 체감**: 지진·화산 목록·지도로 “지금 무엇이 발표됐는지”를 확인한다.
4. **학습·대비**: 계절별 바람 패턴에 따른 화산재 확산·항공 영향을 **가상 시뮬레이션**으로 이해한다.
5. **접근성**: 한국어/영어 전환, 반응형 UI, 가독성 있는 타이포그래피를 제공한다.

### 2.3 비목적 (의도적으로 하지 않는 것)

- 실제 분화 예보·공식 경보 대행
- 수치 기상 모델(NWP) 기반 정밀 ash dispersion 예측
- 사용자 계정·개인정보 수집

---

## 3. 주요 기능

### 3.1 기능 요약

| 구분 | 기능 | 설명 |
|------|------|------|
| 홈 | 히어로·현황 | 가짜뉴스 vs 공식 채널 대비, 경보·관측 요약 |
| 홈 | 라이브 지도 | 한반도 중심 Leaflet 지도 + 지진/화산 마커 |
| 홈 | 사이트 메뉴 | 주요 페이지 바로가기 |
| 홈 | 오늘의 TMI | 새로고침마다 랜덤 무쓸모 사실 (참여·재방문 유도) |
| 콘텐츠 | 재난 정의 | 화산재·관련 용어 설명 |
| 콘텐츠 | 관리 체계 | 국가·지자체 재난 대응 구조 안내 |
| 콘텐츠 | 위기경보 | 4단계 상세 + 수동 선택 / 관측 기반 자동 제안 |
| 콘텐츠 | 행동요령 | 해야 할 일 / 하지 말 일, 상황별 단계, 비상 가방 |
| 콘텐츠 | 영향 브리핑 | 항공·교통 우선 영향, 직·간접 피해 구분 |
| 인터랙션 | 화산재 시뮬 | 계절 선택 → 경로 애니메이션 → 도시·공항 ETA·결항 |
| 실시간 | 화산·지진 목록 | 기상청 API 데이터 카드 UI |
| 연락처 | 비상 연락 | 유관 기관·긴급 번호 |
| 공통 | 경보 배너 | 상단 고정 경보 상태·최신 관측 한 줄 요약 |
| 공통 | 다국어 | KO / EN 전환 (localStorage 유지) |
| 공통 | 모션 | 인트로 스플래시, 스크롤 Reveal/Stagger, 페이지 전환 |
| 공통 | 출처 스탬프 | 데이터 출처·갱신 시각 표시 |

### 3.2 사용자 시나리오 (시연 권장 흐름)

1. 사이트 접속 → 인트로 스플래시 → 홈 현황 확인  
2. 상단 경보 배너에서 현재 단계·최신 화산/지진 한 줄 확인  
3. 지도에서 마커 클릭 → 팝업 정보  
4. **위기경보** 페이지에서 단계 수동 변경 후 배너·히어로 연동 확인  
5. **행동요령**에서 Do/Don’t·상황별 대응 확인  
6. **화산재 시뮬**에서 겨울/여름/봄·가을 선택 후 시뮬레이션 실행  
7. **실시간**에서 목록·새로고침  
8. 언어를 EN으로 전환해 동일 화면 확인  

---

## 4. 기술 스택

### 4.1 프론트엔드

| 기술 | 버전(카탈로그 기준) | 용도 |
|------|---------------------|------|
| React | 19.1 | UI 컴포넌트 |
| TypeScript | ~5.9 | 정적 타입 |
| Vite | ^7.3 | 개발 서버·빌드 |
| Tailwind CSS | ^4.1 | 유틸리티 스타일 |
| wouter | ^3.3 | 경량 클라이언트 라우팅 |
| Leaflet | ^1.9.4 | 인터랙티브 지도 |
| lucide-react | ^0.545 | 아이콘 |
| clsx / tailwind-merge | catalog | className 조합 |

### 4.2 백엔드·인프라

| 기술 | 용도 |
|------|------|
| Vercel Serverless (`api/**/*.js`) | 프로덕션 `/api/earthquake`, `/api/volcano` |
| Vite 커스텀 플러그인 (`kmaPublicApiPlugin`) | 로컬 개발 시 동일 API 경로 프록시 |
| Node.js `fetch` | 기상청·공공데이터 호출 |
| pnpm workspace | 모노레포 의존성·빌드 |

### 4.3 외부 서비스

| 서비스 | 용도 |
|--------|------|
| [기상청 API허브](https://apihub.kma.go.kr/) | 지진(`eqk_now`), 화산(`selectVolcInfoList`) |
| [공공데이터포털](https://www.data.go.kr/) | 지진 보조 소스 (선택) |
| OpenStreetMap 타일 (Leaflet 기본 사용) | 배경 지도 |
| Google Fonts | Noto Sans KR, Inter 등 |

---

## 5. 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                        사용자 브라우저                        │
│  React SPA (wouter) · Leaflet · i18n · Context 상태          │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP
          ┌─────────────────┴─────────────────┐
          │  GET /api/earthquake/recent        │
          │  GET /api/volcano/recent           │
          └─────────────────┬─────────────────┘
                            │
         ┌──────────────────┴──────────────────┐
         │                                     │
   [로컬 개발]                           [프로덕션]
 Vite kmaPublicApiPlugin              Vercel Serverless
 (Node, 동일 JSON 스키마)            api/earthquake|volcano
         │                                     │
         └──────────────────┬──────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │  기상청 API허브 / data.go.kr  │
              └───────────────────────────┘
```

### 5.1 상태 관리

| Context | 역할 |
|---------|------|
| `EarthquakeProvider` | 지진 목록 폴링·캐시·로딩/에러 |
| `VolcanoProvider` | 화산 정보 폴링·캐시 |
| `AlertLevelProvider` | 경보 단계(수동/자동 제안) |
| `I18nProvider` | 언어·번역 함수 `t()` |

페이지 간 경보·관측이 공유되므로 **전역 Context**를 사용한다.  
별도 Redux/Zustand는 도입하지 않았다 (범위 대비 단순성 유지).

### 5.2 배포 산출물

- 정적 사이트: `artifacts/disaster-safety-portal/dist`
- SPA 라우팅: `vercel.json` rewrite → `index.html` (`/api/*` 제외)
- 빌드 진입: `scripts/vercel-build.mjs` → `pnpm --filter @workspace/disaster-safety-portal build`

---

## 6. 디렉터리 구조

```
jaenananjeonpoteol/
├── api/                                # Vercel 서버리스 (CommonJS)
│   ├── _lib/
│   │   └── kma.js                      # 기상청 fetch·CSV 파싱 공통
│   ├── earthquake/
│   │   └── recent.js                   # GET /api/earthquake/recent
│   └── volcano/
│       └── recent.js                   # GET /api/volcano/recent
│
├── artifacts/
│   └── disaster-safety-portal/         # 메인 웹 앱 패키지
│       ├── index.html
│       ├── package.json
│       ├── vite.config.ts
│       ├── kmaPublicApiPlugin.ts       # 로컬 API 미들웨어
│       ├── public/
│       └── src/
│           ├── main.tsx
│           ├── App.tsx                 # 라우터·Provider 조립
│           ├── index.css               # Tailwind + 전역 모션
│           ├── pages/                  # 페이지 단위 라우트 엔트리
│           ├── components/             # UI 섹션·레이아웃·시뮬
│           │   └── motion/             # Reveal, Stagger
│           ├── context/                # React Context
│           ├── hooks/
│           ├── i18n/                   # messages(ko/en), I18nContext
│           └── lib/                    # 도메인 로직·API 클라이언트
│
├── scripts/
│   └── vercel-build.mjs                # 배포 빌드 스크립트
│
├── package.json                        # workspace 루트 스크립트
├── pnpm-workspace.yaml
├── vercel.json
├── .env.example                        # 키 템플릿 (실키 없음)
└── README.md                           # 본 문서
```

> `node_modules/`, `.env`, `.vercel/` 등은 실행·배포 설정용이며 제출 시 키 노출에 주의한다.

---

## 7. 페이지·라우트 명세

라우트 정의: `artifacts/disaster-safety-portal/src/lib/routes.ts`

| 경로 | 키 | 메뉴명(KO) | 주요 컴포넌트 | 내용 |
|------|-----|------------|---------------|------|
| `/` | home | 현황 | `HomePage`, `HeroSection`, `LiveMap`, `TodayTmi` | 랜딩·지도·메뉴·TMI |
| `/definition` | definition | 재난 정의 | `DefinitionSection` | 개념·용어 |
| `/system` | system | 관리 체계 | `SystemSection` | 대응 체계 |
| `/alerts` | alerts | 위기경보 | `AlertLevelsSection` | 4단계 상세·선택 |
| `/guidelines` | guidelines | 행동요령 | `GuidelinesSection` | Do/Don’t·상황별·키트 |
| `/impact` | impact | 영향 브리핑 | `ImpactSection` | 항공 우선 영향 분석 |
| `/simulation` | simulation | 화산재 시뮬 | `AshSimulationSection` | 계절별 확산 시뮬 |
| `/live` | live | 실시간 | `LiveSection` 등 | 화산·지진 목록 |
| `/contacts` | contacts | 연락처 | `ContactsSection` | 비상 연락 |
| (기타) | — | — | `not-found` | 404 |

공통 레이아웃: `SiteLayout`  
→ sticky `Navbar` + `AlertBanner` + `main` + `Footer`

---

## 8. 데이터 연동 (기상청 API)

### 8.1 엔드포인트 (앱 내부)

| Method | Path | 설명 | 캐시(프로덕션) |
|--------|------|------|----------------|
| GET | `/api/earthquake/recent` | 최근 지진 목록 | `s-maxage=30` |
| GET | `/api/volcano/recent` | 화산 정보 목록 | `s-maxage=60` |

### 8.2 외부 원천

| 우선순위 | 지진 | 화산 |
|----------|------|------|
| 1 | 기상청 API허브 `eqk_now` (CSV 파싱) | 기상청 API허브 `selectVolcInfoList` |
| 2 | 공공데이터포털 (키 있을 때) | — |
| 3 | 날씨누리 등 폴백(구현에 포함 시) | — |

### 8.3 응답 스키마 (개념)

공통 필드 개념:

```json
{
  "ok": true,
  "data": [ /* 정규화된 레코드 배열 */ ],
  "fetchedAt": "ISO-8601",
  "source": "kma-apihub | …",
  "error": null
}
```

- **지진 레코드 예**: 규모, 위·경도, 위치, 진도, 발생/발표 시각, 국내·국외 구분  
- **화산 레코드 예**: 화산명, 위치, 분연주 고도, 경보 수준, 발표 시각, 좌표  

프론트 정규화·표시 로직:

- `src/lib/kmaEarthquake.ts`
- `src/lib/kmaVolcano.ts`
- 서버 공유 파싱: `api/_lib/kma.js`

### 8.4 로컬 vs 프로덕션

| 환경 | 처리 주체 | 키 위치 |
|------|-----------|---------|
| `pnpm dev` | Vite `kmaPublicApiPlugin` | 루트 `.env` |
| Vercel | `api/**/*.js` | Project Environment Variables |

**브라우저에 API 키를 넣지 않는다.**  
키는 서버(로컬 미들웨어 또는 Vercel 함수)에서만 사용한다.

---

## 9. 핵심 모듈 상세

### 9.1 위기경보 4단계 (`lib/alertLevels.ts`)

| ID | 한글 | 영문 관용 | 색상 코드 |
|----|------|-----------|-----------|
| `interest` | 관심 | Blue | `#1565C0` |
| `caution` | 주의 | Yellow | `#F9A825` |
| `alert` | 경계 | Orange | `#EF6C00` |
| `serious` | 심각 | Red | `#C62828` |

- 표시 문구는 **i18n** (`alert.{id}.*`)에서 관리한다.
- `AlertLevelContext`는 최근 지진 최대 규모·화산 경보 문자열로 **자동 제안 단계**를 계산한다.
- 사용자가 단계를 수동 선택하면 `manual` 플래그로 고정되며, “제안 단계 따르기”로 복귀할 수 있다.
- 상단 `AlertBanner`·히어로 통계·경보 페이지가 동일 상태를 공유한다.

### 9.2 화산재 확산 시뮬레이션 (`lib/ashSimulation.ts` + `AshSimulationSection`)

**성격**: 교육·대비용 **가상 시나리오** (실제 예보 아님, 화면 내 면책 문구 포함)

| 계절 | 주풍 | 확산 경향 (시나리오) |
|------|------|----------------------|
| 겨울 | 북서풍 | 남동 진출 → 한반도 영향 **큼**, 결항 다수 |
| 여름 | 남서풍 | 북동 진출 → 남한 영향 **약함** |
| 봄·가을 | 편서풍 | 동진 → 동해안·항공 경로 주의 |

**포함 지점**

- 도시: 서울, 부산, 제주  
- 공항: ICN(인천), GMP(김포), PUS(김해), CJU(제주)

**각 지점 메타데이터**

- 예상 도달 시간(h)
- 상대 농도(0–1)
- 항공 상태: `cancel` | `delay` | `watch` | `open`

**인터랙션**

1. 계절 선택  
2. **시뮬레이션 시작** (일시정지 / 이어하기 / 초기화)  
3. SVG 지도 위 플룸 경로 dash 애니메이션 + 플룸 헤드 이동  
4. 전체 Progress Bar + 지점별 Progress Bar  
5. 타임라인 순서(도달 시각 정렬) 및 결항 배지 갱신  

재생 길이: 약 14초 (`SIM_DURATION_MS`)로 가상 시계를 가속한다.

### 9.3 라이브 지도 (`LiveMap.tsx`)

- 기본 시점: 한반도 중심 (`≈ 36.5°N, 127.8°E`, zoom 7)
- 지진: 원형 마커 (규모별 크기·색)
- 화산: 마름모 마커
- 첫 데이터 로드 시 한반도 뷰 고정, 이후 사용자 패닝 유지

### 9.4 행동요령 (`GuidelinesSection.tsx`)

- **해야 할 일 / 하지 말 일** 체크리스트
- 상황별 카드: 비상 가방, 실내 대피, 실외 화산재, 이동 시 등
- 비상 키트 항목 목록
- “콘텐츠 작성 팁”이 아닌 **시민 행동 지침**에 초점

### 9.5 다국어 (`i18n/`)

- `messages.ts`: `ko` / `en` 동일 키 트리
- `t("a.b.c", { n: 1 })` 형태 변수 치환
- 언어 선택 시 `localStorage` (`ndsc-locale`) 및 `document.documentElement.lang` 갱신

### 9.6 오늘의 TMI (`TodayTmi.tsx`)

- 홈 하단 배치
- 제목 접두: 「그거 아세요?」
- **페이지 새로고침마다** 랜덤 항목 (의도적으로 무쓸모한 사실)
- 재난 포털의 긴장감을 완화하는 UX 장치

---

## 10. UI·UX 설계

### 10.1 디자인 원칙

1. **신뢰감**: 네이비 계열 브랜드 컬러(`#0B2B66` 등), 출처 스탬프  
2. **가독성**: 본문 타이포 한 단계 상향, 대비 강화  
3. **긴급 정보 우선**: sticky 경보 배너, 경보 색 체계  
4. **반응형**: 모바일 햄버거 메뉴, 그리드 붕괴  
5. **모션 절제**: `prefers-reduced-motion` 시 애니메이션 축소  
6. **가짜뉴스 대비**: 홈에서 “신뢰하기 어려운 정보 vs 공식 채널” 대비 배치  

### 10.2 공통 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| `Navbar` | 로고, 라우트, 언어 토글, 모바일 메뉴 |
| `AlertBanner` | 경보 단계·시민 행동·최신 관측 요약 |
| `SectionHeader` | 섹션 eyebrow·제목·설명 |
| `SourceStamp` | 출처·갱신 시각 |
| `Reveal` / `Stagger` | 스크롤 등장 애니메이션 |
| `IntroSplash` | 세션당 1회 인트로 |

### 10.3 접근성 고려

- 포커스 링, 버튼 `aria-label` (메뉴·닫기 등)
- 의미 있는 제목 계층
- 색상만으로 상태를 구분하지 않도록 텍스트 배지 병행 (시뮬 결항 상태 등)

---

## 11. 로컬 실행 방법

### 11.1 사전 요구 사항

- Node.js 18+ 권장  
- pnpm (프로젝트는 `pnpm` 강제 — `preinstall` 스크립트)

### 11.2 설치

```bash
# 저장소 클론
git clone https://github.com/Smuhsrooom/jaenananjeonpoteol.git
cd jaenananjeonpoteol

# 의존성 설치
npx pnpm install
# 또는 pnpm install
```

### 11.3 환경 변수

```bash
# 루트에 .env 생성 (.env.example 참고)
cp .env.example .env
```

`.env` 예시:

```env
KMA_APIHUB_AUTH_KEY=여기에_기상청_API허브_키
DATA_GO_KR_SERVICE_KEY=여기에_공공데이터_키_선택
```

- 키 없이 실행 시: UI는 뜨지만 화산 API는 503 등 오류 메시지를 반환할 수 있다.  
- 지진은 소스 폴백에 따라 일부 데이터가 보일 수 있다.

### 11.4 개발 서버

```bash
npx pnpm dev
# 또는 pnpm dev
```

- 기본 주소: **http://localhost:5173/**  
- API: 동일 오리진 `/api/earthquake/recent`, `/api/volcano/recent`

### 11.5 기타 스크립트

```bash
# 프로덕션 빌드
pnpm build

# 타입 검사
pnpm typecheck

# 빌드 결과 미리보기
pnpm --filter @workspace/disaster-safety-portal serve
```

---

## 12. 배포 (Vercel)

### 12.1 설정 요약

| 항목 | 값 |
|------|-----|
| Root Directory | `.` (저장소 루트) |
| Framework | Other (`vercel.json` 사용) |
| Install | `pnpm install` |
| Build | `node scripts/vercel-build.mjs` |
| Output | `artifacts/disaster-safety-portal/dist` |
| Rewrite | SPA → `/index.html` (`api` 제외) |

### 12.2 환경 변수 (Vercel 대시보드)

- `KMA_APIHUB_AUTH_KEY` **(필수, 화산·지진 API허브)**
- `DATA_GO_KR_SERVICE_KEY` (선택)

### 12.3 배포 시 주의

1. `api/**`는 **JavaScript CommonJS**만 사용 (Vercel 런타임 호환).  
2. TypeScript API 파일을 올리면 빌드/런타임 오류가 날 수 있어 제거·금지한다.  
3. `.env`는 git에 올리지 않는다. 키는 Vercel에만 등록한다.

---

## 13. 환경 변수

| 변수명 | 필수 | 설명 | 발급 |
|--------|------|------|------|
| `KMA_APIHUB_AUTH_KEY` | 권장/필수* | 기상청 API허브 인증키 | https://apihub.kma.go.kr/ |
| `DATA_GO_KR_SERVICE_KEY` | 선택 | 공공데이터포털 키 (지진 보조) | https://www.data.go.kr/ |
| `VITE_KMA_APIHUB_AUTH_KEY` | 비권장 | 레거시 별칭 (서버에서만 읽음) | — |
| `BASE_PATH` | 선택 | 서브패스 배포 시 | 기본 `/` |
| `PORT` | 선택 | 개발 서버 포트 | 기본 `5173` |

\* 화산 목록은 API허브 키 없이는 정상 서비스가 어렵다.

---

## 14. 설계 결정 및 구현 이슈

### 14.1 왜 모노레포 + pnpm인가

- 프론트 앱과 루트 API·빌드 스크립트를 한 저장소에서 관리  
- `catalog:`로 React·Vite 등 버전 통일  
- 불필요 패키지 제거(스캐폴드·미사용 UI 키트)로 의존성 단순화

### 14.2 왜 서버리스 API를 분리했는가

- API 키를 클라이언트에 노출하지 않기 위함  
- 로컬은 Vite 플러그인, 프로덕션은 Vercel 함수로 **동일 경로·스키마** 유지

### 14.3 Vercel에서 CommonJS를 쓴 이유

- ESM/TS 서버리스 핸들러 환경에서 `process` 타입·모듈 해석 이슈가 발생  
- 순수 JS CommonJS 핸들러로 안정화

### 14.4 라우팅에 wouter를 쓴 이유

- SPA에 충분한 경량 라우터  
- React Router 대비 번들·개념 단순

### 14.5 시뮬레이션을 “가상”으로 둔 이유

- 정밀 대기 확산 모델은 전문 기관·슈퍼컴퓨팅 영역  
- 과제·교육 목적에서는 **계절 주풍의 방향성·항공 리스크 체감**이 핵심  
- 오용 방지를 위해 화면·문서에 면책을 명시

---

## 15. 한계 및 면책

1. **본 사이트는 공식 재난 경보 시스템이 아니다.**  
   실제 대피·운항 제한은 행정안전부, 기상청, 국토교통부, 항공사 안내를 따른다.
2. 실시간 목록에 해외 화산 등이 포함될 수 있으며, **“지금 백두산이 분화 중”을 의미하지 않는다.**
3. 화산재 시뮬레이션의 도달 시간·결항 여부는 **가정 시나리오**이며 기상 모델 결과가 아니다.
4. API 키 미설정·활용 미신청·쿼터 초과 시 데이터가 비어 있거나 오류가 표시될 수 있다.
5. OpenStreetMap 타일 품질·가용성은 외부 네트워크에 의존한다.

---

## 16. 향후 개선 방향

| 우선순위 | 항목 | 설명 |
|----------|------|------|
| 높음 | 관측 폴링 간격·오프라인 캐시 UX | 네트워크 실패 시 재시도 UI 강화 |
| 높음 | 접근성 감사 | 키보드 전용 내비, 스크린리더 라벨 점검 |
| 중간 | 시뮬 고도화 | 풍속 슬라이더, 분화 규모(VEI) 선택 |
| 중간 | 테스트 | Playwright E2E, API 파서 단위 테스트 |
| 낮음 | PWA | 오프라인 행동요령 캐시 |
| 낮음 | 다국어 확장 | 일본어 등 인근 영향권 언어 |

---

## 17. 참고 자료

1. 기상청 API허브 — https://apihub.kma.go.kr/  
2. 공공데이터포털 지진정보 — https://www.data.go.kr/  
3. 국민재난안전포털 — https://www.safekorea.go.kr/  
4. 기상청 날씨누리 — https://www.weather.go.kr/  
5. 행정안전부 위기관리 매뉴얼 체계 (관심·주의·경계·심각)  
6. 2010 Eyjafjallajökull 항공 운항 중단 사례 (화산재–항공 영향 참고)  
7. React — https://react.dev/  
8. Vite — https://vite.dev/  
9. Leaflet — https://leafletjs.com/  
10. Vercel Serverless Functions — https://vercel.com/docs  

---

## 18. 시연·제출 체크리스트

### 코드·문서

- [x] 소스 코드 (본 저장소)
- [x] `README.md` 명세서 (본 문서)
- [ ] (선택) 발표 슬라이드·데모 영상
- [ ] API 키는 **제출물에 포함하지 않음** (`.env` 제외)

### 로컬 시연

- [ ] `pnpm install` 성공
- [ ] `.env`에 `KMA_APIHUB_AUTH_KEY` 설정
- [ ] `pnpm dev` → http://localhost:5173
- [ ] 홈 지도·경보 배너 동작
- [ ] `/simulation` 계절 3종 실행
- [ ] KO/EN 전환
- [ ] `/live` 목록 로딩

### 배포 시연 (선택)

- [ ] Vercel 환경 변수 등록
- [ ] 프로덕션 URL에서 `/api/earthquake/recent` JSON 확인
- [ ] SPA 직접 URL 진입 (`/guidelines` 등) 정상

### 평가 포인트 (자체 점검)

| 항목 | 구현 위치 |
|------|-----------|
| 실시간 공공 데이터 연동 | `api/`, `kmaPublicApiPlugin`, Context |
| 재난 정보 구조화 | 페이지 9종 + Section 컴포넌트 |
| 인터랙티브 시각화 | Leaflet 지도, 화산재 시뮬 |
| 사용자 행동 유도 | 행동요령, 경보 배너, 연락처 |
| 다국어 | `i18n/messages.ts` |
| 배포 가능한 구성 | `vercel.json`, 서버리스 API |

---

## 부록 A. 루트 npm 스크립트

```json
{
  "dev": "pnpm --filter @workspace/disaster-safety-portal run dev",
  "build": "pnpm --filter @workspace/disaster-safety-portal run build",
  "typecheck": "pnpm --filter @workspace/disaster-safety-portal run typecheck"
}
```

## 부록 B. 주요 파일 빠른 찾기

| 하고 싶은 일 | 파일 |
|--------------|------|
| 메뉴·경로 추가 | `src/lib/routes.ts`, `App.tsx`, `i18n/messages.ts` |
| 번역 수정 | `src/i18n/messages.ts` |
| 경보 단계 로직 | `src/lib/alertLevels.ts`, `AlertLevelContext.tsx` |
| 시뮬 시나리오 수치 | `src/lib/ashSimulation.ts` |
| 지도 기본 위치 | `src/components/LiveMap.tsx` |
| 로컬 API | `kmaPublicApiPlugin.ts` |
| 프로덕션 API | `api/earthquake/recent.js`, `api/volcano/recent.js` |
| 스타일·모션 | `src/index.css` |

## 부록 C. 팀·제출 정보 (작성란)

| 항목 | 내용 |
|------|------|
| 과목명 | *(작성)* |
| 담당 교수 | *(작성)* |
| 제출자 | *(작성)* |
| 학번 | *(작성)* |
| 제출일 | *(작성)* |
| 데모 URL | *(Vercel 등, 선택)* |
| GitHub | https://github.com/Smuhsrooom/jaenananjeonpoteol |

---

**문서 버전**: 1.0  
**대상 코드 기준**: 저장소 `master` 브랜치 (화산재 시뮬레이션 탭 포함)  
**작성 목적**: 과제 제출용 프로젝트 명세서 · 사용 설명서 · 기술 문서 통합본  

> 본 README는 저장소 전체 구조를 분석하여 작성되었으며, 실행 환경·API 키 상태에 따라 화면 데이터는 달라질 수 있습니다.
