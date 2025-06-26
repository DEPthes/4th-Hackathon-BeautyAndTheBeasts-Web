# 일기 분석 및 TTS 앱

일기 텍스트를 입력하면 Gemini AI가 분석하고, 그 결과를 Zonos TTS로 음성 변환하는 웹 애플리케이션입니다.

## 🚀 주요 기능

- **일기 텍스트 입력**: 오늘 하루 있었던 일을 자유롭게 입력
- **AI 분석**: Gemini API를 통한 일기 내용 분석 및 피드백
- **음성 변환**: Zonos TTS를 사용한 고품질 한국어 음성 변환
- **오디오 재생**: 브라우저에서 바로 분석 결과 음성 듣기
- **파일 다운로드**: MP3 형태로 음성 파일 저장

## 🛠️ 기술 스택

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS 4.0
- **State Management**: TanStack React Query
- **API Integration**: Gemini API + Zonos TTS API

## 📋 사전 요구사항

1. **Node.js** 18+ 및 npm/yarn
2. **Zonos TTS 서버** (localhost:8000에서 실행 중이어야 함)
3. **Gemini API 백엔드** (/api/gemini 엔드포인트 필요)

## 🔧 설치 및 실행

### 1. 프로젝트 클론 및 의존성 설치

```bash
git clone <repository-url>
cd 4th-hackathon-beautyandthebeasts-web
npm install
```

### 2. Zonos TTS 서버 설정

자세한 설정 방법은 [ZONOS_SETUP.md](./ZONOS_SETUP.md)를 참조하세요.

```bash
# Zonos TTS 저장소 클론
git clone https://github.com/Zyphra/Zonos.git
cd Zonos

# Docker로 실행 (권장)
docker compose up

# 또는 수동 설치
sudo apt install -y espeak-ng
pip install -U uv
uv sync
uv pip install -e .
python api.py
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하세요.

## 🎯 사용 방법

1. **텍스트 입력**: 오늘 하루 있었던 일을 텍스트 영역에 입력합니다.
2. **분석 요청**: "일기 분석하고 음성으로 듣기" 버튼을 클릭합니다.
3. **결과 확인**: AI가 분석한 결과를 텍스트로 확인합니다.
4. **음성 듣기**: "음성 재생" 버튼을 클릭하여 결과를 음성으로 들어봅니다.
5. **파일 저장**: 필요시 "음성 다운로드" 버튼으로 MP3 파일을 저장합니다.

## 📁 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── Layout.tsx      # 기본 레이아웃
│   ├── Header.tsx      # 헤더
│   └── AudioControls.tsx # 오디오 제어
├── hooks/              # 커스텀 훅
│   └── hook.ts         # API 호출 훅들
├── pages/              # 페이지 컴포넌트
│   └── HomePage.tsx    # 메인 페이지
├── utils/              # 유틸리티 함수
│   ├── api.ts          # API 호출 함수
│   └── classname.ts    # CSS 클래스 유틸
└── Router.tsx          # 라우터 설정
```

## 🔗 API 엔드포인트

### Gemini API

```
POST /api/gemini
Content-Type: application/json

{
  "prompt": "일기 텍스트"
}
```

### Zonos TTS API

```
POST http://localhost:8000/v1/audio/speech
Content-Type: application/json

{
  "model": "Zyphra/Zonos-v0.1-transformer",
  "input": "변환할 텍스트",
  "voice": "default",
  "speed": 1.0,
  "language": "ko-kr",
  "emotion": {
    "happiness": 0.5
  },
  "response_format": "mp3"
}
```

## 🚨 문제 해결

### TTS 서버 연결 실패

- Zonos TTS 서버가 localhost:8000에서 실행 중인지 확인
- 방화벽 설정 확인
- Docker 컨테이너 상태 확인

### 오디오 재생 실패

- 브라우저의 자동 재생 정책 확인
- HTTPS 환경에서 Mixed Content 정책 확인

## 📝 개발 정보

이 프로젝트는 React + TypeScript + Vite 기반으로 개발되었습니다.

### ESLint 설정 확장

프로덕션 애플리케이션 개발 시 타입 인식 린트 규칙을 활성화하는 것을 권장합니다:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
