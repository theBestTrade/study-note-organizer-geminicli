# Study Note Organizer — Gemini CLI 버전

수업·회의 내용을 입력하면 **기본 AI 모델 두 개가 병렬로 학습 일지를 작성**하고, 통합 모델이 **원문 + 두 정리본을 검증**해 최종 문서를 생성하는 React + Vite + Node.js 앱입니다.

## 주요 기능
- 날짜 및 원문 입력, AI 두 모델 병렬 처리 및 최종 통합
- 원문 대조로 누락과 환각 위험 완화 (정확성을 보증하지 않음)
- 선택 가능한 OpenRouter 모델, 다크 모드, 반응형 디자인
- 모델별 결과·오류·처리 시간·토큰 사용량, 히스토리 50개 저장
- 텍스트 복사 및 `YYMMDD_키워드1_키워드2.txt` 다운로드

## 로컬 설치 및 실행
Node.js 22.12 이상을 권장합니다.

```bash
npm ci
```

`.env.example`을 복사해 `.env`를 작성하세요.

```powershell
Copy-Item .env.example .env
```

```dotenv
OPENROUTER_API_KEY=sk-or-v1-여기에-키를-입력
API_PORT=8787
HOST=127.0.0.1
```

```bash
npm run dev
```

Vite가 안내하는 주소(보통 `http://localhost:5173`)에 접속합니다. 서버 프록시가 `/api/chat`을 로컬 백엔드(8787)로 전달합니다. API Key는 **브라우저가 아니라 서버**에만 존재합니다.

## 프로덕션 모드 (Node 서버 필요)

```bash
npm run build
npm run start
```

`http://127.0.0.1:8787`에서 빌드 앱을 제공하며 Node 서버가 OpenRouter에 접근합니다. 정적 페이지만 배포하면 AI 기능이 동작하지 않습니다.

## 시스템 구조

```text
브라우저 React ─ POST /api/chat ─ Node 서버 ─ OpenRouter
                                          ├─ 기본 모델 A (병렬)
                                          ├─ 기본 모델 B (병렬)
                                          └─ 통합 모델: 원문 + A + B
```

- `server/index.mjs` — Node API 프록시
- `scripts/dev.mjs` — 백엔드와 Vite 동시 실행
- `src/hooks/useOpenRouter.ts` — 상대경로 `/api/chat` 호출
- `src/utils/prompts.ts` — 원문 근거 통합 프롬프트
- `src/App.tsx` — 병렬 실행 및 재요청
- `src/components/SettingsPanel.tsx` — 모델 선택 UI (API 키 입력 제거)

## 수정한 위험 요소

| 항목 | 수정 전 | 수정 후 |
|---|---|---|
| API Key 노출 | 브라우저 저장 및 외부 서비스 직접 호출 (매우 높음) | 서버 환경변수 사용 (로컬 낮음) |
| 통합 모델 원문 누락 | 초안 두 개만 전달 (높음) | 원문 + 두 초안 전달 (중간) |
| 빌드 파일 Git 추적 | 기존부터 `node_modules`, `dist` 미추적 (낮음) | 유지, `.env` 제외 명시 (낮음) |
| 공개 배포 악용 | 인증·요청 제한 부재 (높음) | **여전히 높음** — 배포 전 보완 필요 |

## 보안 주의
- API Key를 `VITE_*` 환경변수로 저장하면 클라이언트 번들에 포함될 수 있습니다. 서버 환경변수 `OPENROUTER_API_KEY`만 사용하세요.
- 이전 버전 localStorage에 있던 API Key 필드는 설정 로드 시 걸러지며 새 설정에서 삭제됩니다. 공유 PC라면 브라우저 사이트 데이터를 별도 정리하세요.
- `.env`는 버전 관리에서 제외됩니다. 키가 외부에 공개된 이력이 있다면 OpenRouter에서 키를 폐기하고 재발급해야 합니다.
- 현재는 **로컬 개인용**입니다. 외부 배포 전 로그인·호출 인증·레이트 리미트·월별 과금 한도·사용량 모니터링이 필요합니다.
- 사용자가 입력한 원문과 히스토리는 브라우저에 저장될 수 있으므로 민감정보 입력을 주의하세요.
