# 프로젝트 소개

프로그래머스 데브코스에서 진행한 `바닐라 JS를 이용한 노션 클론코딩`을 추가로 리팩토링 및 배포 진행중입니다

[feel_notion](https://feel-notion.vercel.app/)으로 이동

## Feel 노션 기능 설명

- 글 추가 / 삭제: 좌측 SideBar에 보이는 글 제목 옆의 버튼을 클릭해서 글을 추가하거나 삭제할 수 있습니다
- 글 수정: 좌측 SideBar의 글을 클릭하면 해당 글로 이동합니다
  제목 또는 내용을 수정 시 `2초` 뒤에 수정 요청을 보냅니다
- 알림: 요청의 성공 / 실패 유무를 별도의 Alert로 알려줍니다
- h1, h2, h3 태그: # 또는 ## 또는 ###과 공백을 사용하면 각각 h1, h2, h3처럼 보이도록 수정합니다
  <img src='https://raw.githubusercontent.com/feel0321/feel_notion/docs/README/h1h2h3.gif' />
- 특정 글 링크: `/제목 안내`처럼 입력 시 제목에 `안내`가 들어가는 글 목록을 보여줍니다
  목록 중 하나를 선택 시 해당 글로 이동하는 링크를 생성합니다
  <img src='https://raw.githubusercontent.com/feel0321/feel_notion/docs/README/%EC%A0%9C%EB%AA%A9%EC%B0%BE%EA%B8%B0.gif' />

# 구조

App

- SideBar: 전체 글을 보여줍니다
  - SideBarChildren
- Editor: 특정 글을 보여줍니다
  - FindTitle: 찾을 제목을 보여줍니다
  - EditorChildren: 특정 글 하위의 글을 보여줍니다

기타

- Button
- Alert
