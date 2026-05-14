# Wedding Budget Model

결혼 준비비, 전세대출, 결혼 후 생활비, 개인별 소득/지출, 자산 구입 목표를 계산하는 단일 HTML 재무모델입니다.

## 보기

GitHub Pages 배포 후 아래 형식의 URL에서 볼 수 있습니다.

```text
https://kittycong.github.io/wedding-budget-model/
```

## 파일

- `index.html`: 웹에서 바로 실행되는 결혼·생활 통합 자금 계획 대시보드
- `apps-script/Code.gs`: Google Sheets 저장용 Apps Script 웹앱 코드

## Google Sheets 저장 설정

1. Google Sheets에서 새 스프레드시트를 만듭니다.
2. 스프레드시트 URL에서 ID를 복사합니다.
3. `apps-script/Code.gs` 내용을 Apps Script에 붙여넣습니다.
4. `SHEET_ID` 값을 복사한 스프레드시트 ID로 바꿉니다.
5. Deploy > New deployment > Web app으로 배포합니다.
6. Web app URL을 대시보드의 `구글시트 저장` 탭에 입력합니다.
7. 계정 키에는 본인 이메일 또는 고정 닉네임을 입력합니다.
