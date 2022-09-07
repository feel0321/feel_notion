import { $create, $select } from "../../utils/dom.js";
import FindTitle from "./FindTitle.js";
import EditorChildren from "./EditorChildren.js";
import { getDoc, updateDoc } from "../request/index.js";

export default class Editor {
  constructor({ $target, initialState, FuncAppRoute, displayAlert }) {
    const findTitle = new FindTitle({
      $target,
      initialState: null,
    });

    const $input = $create("input");
    $input.setAttribute("placeholder", "제목을 입력해주세요.");

    const $contentContainer = $create("div");
    $contentContainer.classList.add("editor-content-container");

    const editorChildren = new EditorChildren({
      $target,
      initialState: initialState.info.documents,
      FuncAppRoute: () => {
        FuncAppRoute();
        findTitle.setState({ nextState: null });
      },
    });

    this.timer = null;
    this.state = initialState;
    this.FuncAppRoute = FuncAppRoute;
    this.displayAlert = displayAlert;
    this.findTitle = findTitle;
    this.$input = $input;
    this.$contentContainer = $contentContainer;
    this.editorChildren = editorChildren;
    this.setEvent();
    this.render();
    $target.appendChild($input);
    $target.appendChild($contentContainer);
  }

  // data 저장 요청 디바운스
  // isReload에 따라서 로직 추가 수행 (sidebar 갱신)
  saveEditor() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(async () => {
      const { id } = this.state.info;
      try {
        await updateDoc(
          id,
          this.$input.value,
          this.$contentContainer.innerHTML
        );
        this.displayAlert({
          text: `${id}번 문서를 수정했습니다.`,
          ok: true,
        });
        this.FuncAppRoute();
      } catch (e) {
        this.displayAlert({
          text: `${id}번 문서 수정에 실패했습니다.`,
          ok: false,
        });
      }
    }, 2000);
  }

  setEvent() {
    this.$input.addEventListener("keyup", () => {
      document.title = this.$input.value;
      this.saveEditor(true);
    });

    let isKeyDownShift = false;
    this.$contentContainer.addEventListener("keydown", (e) => {
      if (e.key === "Shift") {
        isKeyDownShift = true;
      }
    });

    this.$contentContainer.addEventListener("keyup", (e) => {
      // $contentContainer 내용을 다 지우면, <div class="editor-content"></div> 생성
      if (e.key === "Backspace" && !this.$contentContainer.innerHTML) {
        const $newDiv = $create("div");
        $newDiv.className = "editor-content";
        this.$contentContainer.appendChild($newDiv);
      }
    });

    this.$contentContainer.addEventListener("keyup", (e) => {
      // Shift 안누른 그냥 Enter일 때는 기본 블록으로
      if (e.key === "Enter" && !isKeyDownShift) {
        const nextNode = window.getSelection().anchorNode;

        // 글 맨 끝에 엔터칠 때
        if (nextNode.parentElement === this.$contentContainer) {
          nextNode.className = "editor-content";
          return;
        }
        // 글 중간에 엔터칠 때
        nextNode.parentElement.className = "editor-content";
      }
    });

    this.$contentContainer.addEventListener("keyup", (e) => {
      if (e.key === "Shift") {
        isKeyDownShift = false;
      }
    });

    this.$contentContainer.addEventListener("input", () => {
      const { anchorNode, anchorOffset } = window.getSelection();
      const { parentElement, textContent } = anchorNode;

      // 현재 커서가 '/제목 찾을제목'으로 시작하면
      if (parentElement.textContent.startsWith("/제목 ")) {
        const targetTitleName = parentElement.textContent.substring(
          4,
          anchorOffset
        );

        // 찾을제목이 들어가는지 검색
        const sameTitle = this.state.flatRoot.filter(({ title }) =>
          title.includes(targetTitleName)
        );
        // 찾을제목이 있으면 findTitle을 노출
        if (sameTitle.length) {
          const { left, bottom } = parentElement.getBoundingClientRect();
          this.findTitle.setState({ nextState: sameTitle, left, top: bottom });
        } else {
          this.findTitle.setState({ nextState: null });
        }
      } else {
        this.findTitle.setState({ nextState: null });
      }

      // '### '로 시작하면 h3처럼 보이게 수정
      if (textContent.startsWith("### ") || textContent.startsWith("### ")) {
        parentElement.className = "editor-content h3";
        parentElement.innerHTML = parentElement.innerHTML.replace("### ", "");
        parentElement.innerHTML = parentElement.innerHTML.replace(
          "###&nbsp;",
          ""
        );
      }

      // '## '로 시작하면 h2처럼 보이게 수정
      if (textContent.startsWith("## ") || textContent.startsWith("## ")) {
        parentElement.className = "editor-content h2";
        parentElement.innerHTML = parentElement.innerHTML.replace("## ", "");
        parentElement.innerHTML = parentElement.innerHTML.replace(
          "##&nbsp;",
          ""
        );
      }

      // '# '로 시작하면 h1처럼 보이게 수정
      if (textContent.startsWith("# ") || textContent.startsWith("# ")) {
        parentElement.className = "editor-content h1";
        parentElement.innerHTML = parentElement.innerHTML.replace("# ", "");
        parentElement.innerHTML = parentElement.innerHTML.replace(
          "#&nbsp;",
          ""
        );
      }

      this.saveEditor();
    });

    // '/제목 찾을제목'으로 생성한 a태그 클릭시 이동
    this.$contentContainer.addEventListener("click", (e) => {
      const { classList, dataset } = e.target;

      if (classList.contains("anchor")) {
        history.pushState(null, null, `/documents/${dataset.id}`);
        this.FuncAppRoute();
        $select(".editor-content-container").scroll(0, 0);
        this.findTitle.setState({ nextState: null });
      }
    });
  }

  async setState({ documentId, flatRoot }) {
    try {
      if (documentId === null) {
        const info = { createdAt: "", documents: null };
        this.state = { ...this.state, info };
      } else if (documentId) {
        const info = await getDoc(documentId);
        this.state = { ...this.state, info };
      }

      if (flatRoot) {
        this.state = { ...this.state, flatRoot };
      }

      document.title = this.state.info.title || "Feel Notion";
      this.editorChildren.setState(this.state.info.documents);
      this.render();
    } catch (e) {
      this.displayAlert({ text: "문서를 가져오지 못했습니다.", ok: false });
    }
  }

  render() {
    const { info } = this.state;

    // 첫 페이지 아무 선택 X
    if (!info?.createdAt) {
      this.$input.classList.add("none-data");
      this.$contentContainer.setAttribute("contenteditable", false);
      this.$contentContainer.innerHTML = `<h1>Feel Notion에 온것을 환영합니다</h1>`;
      return;
    }
    this.$contentContainer.setAttribute("contenteditable", true);
    this.$contentContainer.classList.remove("none-data");
    if (info?.content) {
      this.$contentContainer.innerHTML = info.content;
    } else {
      this.$contentContainer.innerHTML = `<div class="editor-content" contentEditable="true"></div>`;
    }
    this.$input.classList.remove("none-data");
    this.$input.value = info?.title;
  }
}
