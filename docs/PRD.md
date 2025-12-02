📄 Feedback Generator – Product Requirements Document (PRD)

Last Updated: 2025-12-01

1. 제품 개요 (Overview)

Feedback Generator는 고객이 디자이너에게 피드백을 전달할 때 용어·표현·구조가 맞지 않아 생기는 의사소통 불편을 해소하는 서비스이다.
이미지를 기반으로 영역을 표기하거나 단순 텍스트만으로 전달되는 고객의 피드백을 LLM이 자동으로 정제된 구조화된 피드백 메시지로 변환해준다.

주요 목적:

고객 → 디자이너 피드백 정확도 향상

피드백 작성 시간 단축

디자이너의 요구사항 이해도 향상

메시지 형식(메신저/이메일)에 맞춘 자동 포맷팅

2. 주요 사용자 시나리오 (User Scenario)
(1) 고객 사용자

디자인 초안 또는 수정본을 캡처

UI 요소에 박스/하이라이트 표기를 할 수도 있고 안 할 수도 있음

피드백 텍스트 입력

출력 타입 선택 (메신저/이메일)

“피드백 메시지 생성” 클릭

깔끔하게 정제된 피드백을 복사

필요 시 히스토리에서 이전 생성본을 불러오기

(2) 디자이너

고객이 전달한 메시지를 더 일관된 구조로 받아 이해도 향상

항목별, 번호별 요구사항이 명확하게 정리된 형태로 수신

3. 제품 목표 (Goals)
1) 피드백의 명확한 전달

번호 유지 / 자동 생성

문장 통일

디자이너가 이해하기 쉬운 구조로 전환

2) 이미지 기반 보조 해석

고객이 설명을 생략하더라도 이미지에서 기본적인 UI 요소 분석
(여백, 정렬, 대비, 텍스트 크기 등)

하지만 사용자가 말하지 않은 요구사항은 절대 추가하지 않음

3) 출력 스타일 두 가지

메신저 버전

짧고 간결

1~2줄 요약형

이메일 버전

제목+설명 구조

정중한 톤

2~3줄 상세 안내

4) UI/UX의 큰 목표

Apple-like 깔끔하고 고급스러운 라이트 테마

카드형 UI

간결한 컴포넌트 구조

5) 로컬 히스토리 저장

최근 10개까지 로컬스토리지 저장

다시 불러와 재활용 가능

4. 기능 요구사항 (Feature Requirements)
4.1 핵심 기능(Core Features)
F1. 이미지 업로드

사용자는 JPG/PNG 등의 이미지 업로드 가능

업로드한 이미지를 JPG/PNG → Base64로 변환해 LLM에 전달

클릭하여 업로드, 드래그앤드롭은 추후 옵션

F2. 피드백 텍스트 입력

Multi-line 텍스트 입력 지원

4줄~무제한

Apple-like 라운드 박스 + Shadow

F3. 출력 타입 선택

Dropdown

메신저(간단)

이메일(상세)

텍스트 입력창 바로 아래에 위치

F4. LLM 기반 피드백 생성

모델: GPT-5-mini (이미지+텍스트 멀티모달 지원)

입력 구성:

systemPrompt

text block

image block

출력:

output_text 1개 블록

max_output_tokens 증가 → 긴 결과 생성 보장

F5. 결과 출력 박스

카드형 UI

copy to clipboard

다시 생성 버튼

F6. 히스토리 기능

localStorage

최대 10개

HistoryModal로 조회

클릭 시 다시 불러오기

4.2 UI/UX Requirements
디자인 원칙

Light theme 강제

Apple-like minimalism

모든 컴포넌트는 동일한 색상·레이아웃·radius 적용

shadow-sm + border-gray-200 기반의 카드 UI

SF Pro 스타일과 유사한 타이포 스케일

충분한 여백(16~24px)

레이아웃 요구사항

페이지는 2xl 기준 최대 폭 640px

모바일 우선

5. 기술 요구사항 (Technical Requirements)
5.1 Frontend

Next.js 15 (app router)

React Server Components + Client Components

TailwindCSS

TypeScript (strict)

5.2 Backend (API Route)

/api/generate

OpenAI Responses API 호출

input → text + image blocks

output → output_text block

에러 핸들링 및 JSON 반환

5.3 LLM 프롬프트 구조

Compact System Prompt 적용

이미지 분석은 보조적 중간 레벨

출력 스타일에 따라 다른 톤 사용

6. 비기능 요구사항 (NFR)
성능(NFR-1)

LLM 응답이 3~10초 내 제공되도록 API 최적화

이미지 Base64 크기 제한 (권장 < 1MB)

신뢰성(NFR-2)

로컬 히스토리는 언제나 유지되며, 재시작해도 남아 있어야 한다.

보안(NFR-3)

업로드 파일은 서버에 저장하지 않고 LLM 요청 외에는 보관하지 않음

확장성(NFR-4)

향후 크레딧 기반 요금제에 확장 가능하도록 API 구조 단순화

7. 향후 로드맵 (Roadmap)
Phase 1 (현재 단계)

MVP 구축

이미지+텍스트 기반 LLM 호출

Apple UI 적용

로컬 히스토리

Phase 2

Drag & Drop 이미지 업로드

히스토리 커버 이미지 표시

Copy 시 Toast 알림

Phase 3

사용자 계정/로그인

크레딧 시스템

'이전 버전과 비교' 기능

텍스트에서 자동으로 번호 잡아주기

Phase 4

팀/디자이너 공유 링크

프로젝트 단위 히스토리

디자인 QA 체크리스트 자동 생성

8. 화면 구성 (UI Wireframe 개요)
[Header]
  Feedback Generator        [히스토리]

[카드 wrapper]
  [이미지 업로드 박스]

  [텍스트 입력 박스]

  [출력 타입 선택]

  [생성 버튼]

  [결과 카드(생성 후 표시)]

9. 성공 지표 (Success Metrics)

피드백 생성 완료율 70% 이상

히스토리 재사용 비율 30%

평균 생성 시간 10초 이하

사용자 재방문율 40%

10. 부록 (Appendix)
A. 시스템 프롬프트 (Compact Version)
당신은 디자인 피드백을 명확하고 실행 가능하게 재작성하는 AI입니다.
- 사용자의 피드백을 더 이해하기 쉬운 문장으로 정리합니다.
- 이미지는 보조적으로 사용하며 여백·배치·정렬·명암·텍스트 크기만 해석합니다.
- 사용자가 말하지 않은 요구사항을 추가하지 않습니다.
- 번호는 유지하거나 자동 생성합니다.
- 출력 모드는 messenger/email 형식에 맞게 작성합니다.
- 오직 텍스트만 출력합니다.