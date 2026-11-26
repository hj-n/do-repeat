# Do Repeat

무엇이든 매일 반복하고, 위치나 사진으로 인증해서 연속 기록(D+N)을 쌓는 앱입니다.

지금은 **앱 기능과 디자인(화면)** 위주로 개발하고 있어요. 서버와 배포는 나중에 붙입니다.

## 기술

- [Expo](https://expo.dev) (React Native) + TypeScript: 코드 하나로 iOS, Android, 웹에서 실행됩니다.
- Expo Router: `src/app/` 폴더 안의 파일 하나가 화면 하나입니다.

## 폴더 구조

```
src/
  app/                    화면 (파일 = 화면 주소)
    index.tsx             시작: 반복이 있으면 홈, 없으면 온보딩
    onboarding/
      index.tsx           1단계: 무엇을 반복하실 건가요?
      method.tsx          2단계: 어떻게 인증할까요? (위치 / 사진)
      place.tsx           3단계 (위치): 지금 위치를 내 장소로 등록
      ready.tsx           3단계 (사진): 확인하고 시작
    home.tsx              홈: 반복 카드 (D+N, 최근 7일, 오늘 인증하기)
    check-in/[id].tsx     오늘 인증하기 (위치 / 사진)
    settings.tsx          설정: 언어, 개발용 도구
  features/               화면을 이루는 큰 부품 (반복 카드, 인증 흐름)
  components/             버튼, 칩, 입력창 같은 공통 부품
  constants/theme.ts      디자인 토큰 (색, 글자 크기, 간격, 둥글기)
  i18n/locales/           앱 문구: en.ts(영어), ko.ts(한국어)
  store/app-store.ts      앱 데이터 (지금은 기기에 저장, 나중에 서버로 교체)
  lib/                    연속 일수 계산, 거리 계산, 위치·카메라
locales/                  iOS/Android 시스템 문구 (권한 안내 등) 번역
scripts/
  build-preview.mjs       웹 미리보기 빌드
```

- **디자인:** `src/constants/theme.ts`에서 색과 글자 크기를 바꾸면 모든 화면에 반영됩니다.
- **문구:** 화면에 보이는 글자는 모두 `src/i18n/locales/en.ts`와 `ko.ts`에 있어요. 문구를 추가하면 두 파일에 같은 키로 넣어야 하고, 하나라도 빠지면 타입 검사(`npx tsc --noEmit`)가 알려줍니다.
- **언어:** 기기 언어가 한국어면 한국어, 그 외에는 영어로 시작하고, 설정에서 바꿀 수 있어요.
- **연속 기록 규칙:** 하루는 기기 시간 기준 자정부터 자정까지예요. 하루에 여러 번 인증해도 1번으로 세고, 하루라도 빠지면 다시 시작합니다(`src/lib/streak.ts`).
- **위치 인증:** 등록한 장소에서 150m 안이면 인증돼요. 실내 GPS 오차를 감안해 정확도만큼 여유를 줍니다(`src/lib/geo.ts`).

## 화면 보기

### 1. claude.ai 미리보기 페이지 (설치 없이)

Claude Code 클라우드 세션에서 작업할 때는 화면을 바꿀 때마다 Claude가 웹 미리보기를 빌드해서 같은 주소의 claude.ai 페이지에 다시 올립니다. 휴대폰이나 PC 브라우저로 그 페이지를 열어두면 됩니다.

```bash
npm run preview:build   # preview/index.html 생성
```

미리보기 페이지에서는 브라우저 보안 때문에 실제 GPS나 카메라를 쓸 수 없어요. 위치는 흉내 내고(설정 > 개발용 도구 > 미리보기 위치에서 "장소 안/밖"을 바꿀 수 있어요), 사진은 파일에서 고릅니다.

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
