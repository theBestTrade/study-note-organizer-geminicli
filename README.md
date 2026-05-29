# 학습 일지 정리기 (Study Note Organizer)

하루치 수업/회의 내용을 붙여넣으면, 선택한 2개 모델이 각각 정리하고, 통합 모델이 최종본을 만들어 주는 멀티 에이전트 웹 툴입니다.

## 주요 기능

- **멀티 에이전트 정리**: 2개의 기본 모델이 독립적으로 정리하고, 1개의 통합 모델이 장점만 모아 최종본 생성.
- **OpenRouter 통합**: 최신 LLM(Claude, GPT, Gemini, DeepSeek 등)을 OpenRouter를 통해 호출.
- **다크 모드 지원**: 시스템 설정 및 수동 토글 지원.
- **히스토리 관리**: 최근 50개의 정리 내역을 로컬에 저장하고 복원 가능.
- **TXT 다운로드**: {YYMMDD}_{키워드1}_{키워드2}.txt 형식으로 결과 저장.
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화 레이아웃.

## 시작하기

### 설치

```bash
npm install
```

### 실행

```bash
npm run dev
```

### 빌드

```bash
npm run build
```

## OpenRouter API Key 발급 및 설정

1. [OpenRouter](https://openrouter.ai/)에 가입하고 로그인합니다.
2. [Keys](https://openrouter.ai/keys) 페이지에서 새 API Key를 발급받습니다.
3. 앱 우측 상단의 톱니바퀴(설정) 아이콘을 클릭하여 API Key를 입력하고 저장합니다.

## 보안 주의사항

- 이 앱은 API Key를 브라우저의 `localStorage`에 저장합니다. 공용 PC에서는 사용 후 히스토리와 설정을 초기화하거나 시크릿 모드를 사용하세요.
- API Key는 클라이언트 측에서 직접 사용되므로 외부에 노출되지 않도록 주의하십시오.

## 기술 스택

- React 19 + TypeScript
- Vite
- TailwindCSS v4
- Lucide React (Icons)
- OpenRouter API
