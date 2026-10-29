# 모바일 초대장 웹페이지

스마트폰에서 보는 것을 1순위로 한 반응형 초대장 페이지. D-day 카운트다운과 장소 지도를 포함한다.

## 기술 스택
- 순수 HTML / CSS / JavaScript (ES6+) 만 사용
- 프레임워크·번들러·빌드 도구·npm 의존성 금지 (React, Vue, Tailwind, Bootstrap, jQuery 등)
- 외부 라이브러리는 지도 SDK 외에는 추가하지 않는다
- 빌드 없이 `index.html`을 브라우저로 열거나 정적 서버로 바로 동작해야 한다

## 파일 구조
```
index.html        # 마크업 (시맨틱 태그)
css/style.css     # 스타일 (CSS 변수, 모바일 우선)
js/config.js      # 행사 정보 (날짜, 장소, 좌표, 문구) — 내용 수정은 여기서만
js/dday.js        # D-day 계산·표시
js/map.js         # 지도 표시
images/           # 이미지 (WebP/JPEG, 압축된 것)
```
- 행사 내용(이름, 일시, 장소, 좌표, 연락처)은 `config.js` 한 곳에 모으고 HTML/JS에 하드코딩하지 않는다.

## 핵심 기능

### D-day
- 행사일은 `config.js`의 ISO 문자열(예: `2026-12-20T14:00:00+09:00`)로 관리, 타임존은 KST 명시
- 표시: `D-N`, 당일은 `D-DAY`, 지난 후는 `행사가 종료되었습니다`
- 일/시/분/초 카운트다운은 `setInterval` 1초 갱신, 탭이 숨겨지면 불필요한 갱신 최소화
- 날짜 계산은 자정 기준(날짜 단위) 차이로 계산해 시간대·DST 오차가 없게 한다
- 사용자 기기 시간대와 무관하게 KST 기준으로 계산

### 장소 지도
- 확정: OpenStreetMap embed iframe (API 키 불필요). 좌표는 `config.js`의 `place.lat/lng`, 마커·bbox URL은 `map.js`가 생성
- 장소명/주소 텍스트를 항상 함께 표기하고, 버튼은 주소 복사 / 큰 지도(OSM) / 네이버지도 / 카카오맵 링크 (모두 키 불필요 웹 URL)
- 지도 로딩 실패(8초 내 load 없음) 시 안내 문구를 보여주고 주소·링크는 그대로 유지
- OSM 저작권 표기(`© OpenStreetMap contributors`)를 지도 아래에 유지
- 지도 영역은 `loading="lazy"`로 지연 로드

## 모바일 반응형 기준
- `<meta name="viewport" content="width=device-width, initial-scale=1">` 필수
- 모바일 우선(min-width 미디어쿼리로 확장), 기준 폭 360~430px, 데스크톱에서는 가운데 정렬된 최대 폭(약 480px) 컨테이너
- 가로 스크롤 금지, 고정 px 폭 대신 `%`, `rem`, `clamp()`, flex/grid 사용
- 터치 타겟 최소 44×44px, 본문 글자 16px 이상
- 100vh 대신 `100dvh` 사용 (모바일 주소창 대응), `env(safe-area-inset-*)` 고려
- 한글 줄바꿈: `word-break: keep-all`
- 이미지: `max-width: 100%`, `width/height` 명시(레이아웃 시프트 방지), 스크롤 아래 이미지는 `loading="lazy"`

## 코딩 규칙
- HTML: 시맨틱 태그(`header`, `main`, `section`, `footer`), 이미지 `alt` 필수
- CSS: 색상·간격·폰트는 `:root` CSS 변수로 정의, 클래스는 kebab-case, `!important` 지양
- JS: IIFE 패턴 일반 스크립트 (`file://`로 열어도 동작해야 하므로 `type="module"` 사용 금지), 전역은 `window.INVITATION`만, DOM 접근은 `data-*` 속성 사용
- 주석과 문구는 한국어, 식별자는 영어
- 접근성: 대비 4.5:1 이상, `prefers-reduced-motion` 존중, 버튼·링크에 명확한 레이블

## 성능
- 이미지 합계 1MB 이하 권장, 웹폰트는 1~2종 + `font-display: swap` (또는 시스템 폰트)
- 외부 요청은 지도·폰트 외에 만들지 않는다
- 공유 시 미리보기용 OG 태그(`og:title`, `og:description`, `og:image`) 포함

## 확인 방법
- 로컬 실행: `index.html` 직접 열기, 또는 `python -m http.server 8000` 후 `http://localhost:8000`
- 브라우저 개발자 도구의 모바일 에뮬레이션(375×812, 360×640, 430×932)으로 확인
- 확인 항목: D-day 숫자 정확성(행사 전/당일/후), 지도·길찾기 링크 동작, 가로 스크롤 없음, 콘솔 에러 없음

## 작업 규칙
- 요청받지 않은 기능·파일을 추가하지 않는다
- 기존 구조·스타일을 먼저 읽고 맞춰서 수정한다
- `git commit`/`push`는 사용자가 요청할 때만 수행한다
- 개인정보(실제 연락처 등)는 사용자가 제공한 값만 사용하고 임의로 만들지 않는다
