# Do Repeat

무엇이든 매일 반복하고, 위치나 사진으로 인증해서 연속 기록(D+N)을 쌓는 앱입니다.

지금은 **앱 기능과 디자인(화면)** 위주로 개발하고 있어요. 서버와 배포는 나중에 붙입니다.

## 기술

- [Expo](https://expo.dev) (React Native) + TypeScript: 코드 하나로 iOS, Android, 웹에서 실행됩니다.
- Expo Router: `src/app/` 폴더 안의 파일 하나가 화면 하나입니다.

## 폴더 구조

```
src/
  app/                  화면 (파일 = 화면 주소)
    index.tsx           온보딩 1: What do you repeat?
    onboarding/
      method.tsx        온보딩 2: 어떻게 인증할까요?
      ready.tsx         온보딩 3: 준비됐어요 (임시 마지막 화면)
  components/           버튼, 칩, 카드 같은 공통 부품
  constants/theme.ts    디자인 토큰 (색, 글자 크기, 간격, 둥글기)
  hooks/                라이트/다크 모드
  lib/                  작은 도구 함수
scripts/
  build-preview.mjs     웹 미리보기 빌드
```

디자인을 바꿀 때는 먼저 `src/constants/theme.ts`를 보세요. 색과 글자 크기를 여기서 바꾸면 모든 화면에 반영됩니다.

## 화면 보기

### 1. claude.ai 미리보기 페이지 (설치 없이)

Claude Code 클라우드 세션에서 작업할 때는 화면을 바꿀 때마다 Claude가 웹 미리보기를 빌드해서 같은 주소의 claude.ai 페이지에 다시 올립니다. 휴대폰이나 PC 브라우저로 그 페이지를 열어두면 됩니다.

```bash
npm run preview:build   # preview/index.html 생성
```

미리보기 페이지에서는 브라우저 보안 때문에 실제 GPS나 카메라를 쓸 수 없어요. 위치와 사진 기능은 미리보기에서 흉내 내는 방식으로 보여줄 예정입니다.

### 2. 내 PC + 휴대폰에서 실시간으로 (저장하면 바로 반영)

PC에 [Node.js](https://nodejs.org)를 설치하고, 휴대폰에 **Expo Go** 앱을 설치한 다음:

```bash
git clone https://github.com/hj-n/do-repeat.git
cd do-repeat
npm install
npx expo start
```

터미널에 나오는 QR 코드를 휴대폰으로 찍으면 앱이 열립니다. 이 방법에서는 실제 GPS와 카메라가 동작해요. PC 브라우저로 보려면 터미널에서 `w`를 누르세요. PC와 휴대폰은 같은 Wi-Fi에 연결되어 있어야 합니다.

## 확인 명령

```bash
npx tsc --noEmit   # 타입 검사
npx expo lint      # 코드 스타일 검사
```
