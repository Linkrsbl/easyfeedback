📘 DEV_HISTORY.md
EasyFeedback 개발 히스토리 & 기술적 결정 기록

본 문서는 EasyFeedback 서비스 개발 과정 중 발생한 기술적 문제들, 해결 과정, 기능 추가 내역, 구조 변경 사항 등을 기록한 개발 히스토리 문서이다.
PRD.md가 “무엇을 할 것인가”를 정의했다면, 이 문서는 **“어떻게 여기까지 왔는가”**를 정리한다.

1. 프로젝트 개요

EasyFeedback은
업로드된 이미지 + 사용자가 작성한 문장을 기반으로
디자인 피드백·문서 피드백을 자동 생성하는 서비스이다.

핵심 기능:

이미지 업로드 및 미리보기

이미지 위에 직접 드로잉/수정(Excalidraw 기반)

피드백 텍스트 입력

출력 포맷 선택(메신저형 / 이메일형)

AI 기반 피드백 생성(OpenAI API)

히스토리 저장(LocalStorage)

모바일 대응 UI

2. 기능 추가 및 변경 히스토리
✅ 2.1 이미지 업로드 기능 정비

기본 이미지 업로드 컴포넌트 구현 완료

원본 이미지 URL을 상태(image)로 보관

AI 피드백 요청 시 해당 URL을 그대로 전달하는 구조

✅ 2.2 "이미지 위에 그리기" 기능 도입
■ 목표

사용자가 업로드한 이미지에 펜, 텍스트 등으로 수정 표시 가능해야 함.

■ 도입 라이브러리: Excalidraw
■ 도입 후 문제들

Excalidraw API가 ref로 전달되지 않음

모달 열림과 API 초기화 타이밍 불일치

이미지가 캔버스에 표시되지 않음

exportToBlob 시 에러 발생

Next.js SSR 환경에서 window is not defined 오류 발생

타입 오류로 빌드 실패 (ExcalidrawImperativeAPI 삭제됨)

■ 해결 결과

ref 방식 → excalidrawAPI={(api)=>...} 방식으로 수정

모달 OPEN / API READY 두 타이밍 중 하나라도 충족 시 이미지 삽입

ExcalidrawAny로 타입 문제 완전 해소

SSR 문제 → 모달 자체가 클라이언트 컴포넌트라 해결됨

exportToBlob 정상 동작

✅ 2.3 Excalidraw 이미지 삽입 알고리즘 개선

업로드된 이미지가 자동으로:

캔버스 80% 범위 안으로 스케일링

캔버스 중앙 배치

Excalidraw 파일 시스템에 등록

요소 목록(elements)에 image 타입으로 추가

히스토리 리셋

✅ 2.4 “적용하기” 기능 완성

문제:

exportToBlob 호출 시 null elements, 잘못된 appState 전달 등으로 실패

해결:

elements = api.getSceneElements()

files = api.getFiles()

viewBackgroundColor 강제 지정

Blob을 CreatePage로 전달 → ObjectURL 변환 후 preview 출력

결국 유저가 그린 이미지를 최종 이미지로 대체하는 구조 완성

3. 페이지 구조 개선 (page.tsx)
핵심 관리 상태
상태	설명
image	업로드한 이미지 / 편집된 이미지의 URL
editedBlob	Excalidraw에서 export된 Blob
feedbackRaw	사용자가 입력한 피드백
mode	출력 포맷(messenger/email)
loading	AI 요청 중인지 여부
loadingStage	단계별 로딩 메시지
aiResponse	AI로부터 받은 결과
result	실제 화면에 표시되는 결과
isHistoryOpen	히스토리 모달
isExcalidrawOpen	이미지 편집 모달
4. AI 응답 단계 처리
목적

단순 로딩 스피너 대신 3단계 애니메이션 효과 구현.

단계

이미지를 분석하는 중…

핵심 내용을 정리하는 중…

결과를 정돈하는 중…

각 단계마다 setTimeout 기반으로 자연스러운 진행감을 부여.

5. 히스토리 기능(LocalStorage)

저장 구조:

{
  id: string;
  image: string;
  raw: string;
  result: string;
  mode: "messenger" | "email";
  createdAt: number;
}


최대 10개 저장
중복 X
불러오기 기능 지원

6. 주요 기술적 문제 & 해결 요약
문제	원인	해결
Excalidraw API가 undefined	ref 사용 불가	excalidrawAPI prop 사용
업로드 이미지가 캔버스에 안 뜸	API 초기화보다 insertImage 먼저 실행	API READY 시점에서도 삽입하도록 변경
exportToBlob 실패	appState, files 누락	모든 파라미터 올바르게 채워넣음
빌드 실패	타입 정의 제거됨	ExcalidrawAny(완전 any) 사용
SSR 오류	window is not defined	모달을 강제 client 컴포넌트로 처리
UIOptions 타입 불일치	Excalidraw 타입 변경	any 래퍼로 통일
7. 현재 기능 상태 (2025.02 기준)
기능	상태
이미지 업로드	완료
이미지 편집(Excalidraw)	완벽히 동작
편집본 export 후 반영	완료
피드백 생성(AI)	완료
히스토리 기능	완료
모바일 대응	기본 동작 보장
에러 핸들링	기본 처리
8. 다음 작업 후보(로드맵)

Excalidraw에서 특정 도구만 띄우는 커스텀 UI

필기, 형광펜 등 프리셋 스타일 추가

S3 업로드 도입 → ObjectURL 대신 안정적 URL 사용

AI 이미지 분석 고도화(객체 감지 + 개선 포인트 자동 마킹)

다중 이미지 지원

PDF 피드백 생성 기능

9. 결론

Excalidraw 편집 기능은 본 프로젝트 가장 난이도 높은 컴포넌트였으며:

Next.js 클라이언트/서버 구조

Excalidraw의 변경된 API 구조

이미지 삽입 타이밍

exportToBlob 처리

타입 오류

빌드 오류

SSR 오류

등 다양한 문제를 모두 해결해 완전한 사용자 경험을 구축했다.

현재 EasyFeedback의 핵심 기능은 안정적으로 구현 완료된 상태이다.