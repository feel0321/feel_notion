import { $create } from "../../utils/dom.js";
import Editor from "./Editor.js";
import SideBar from "./SideBar.js";
import Alert from "./Alert.js";
import { getDocs } from "../request/index.js";

export default class App {
  constructor({ $target, initialState }) {
    const myAlert = new Alert({
      $target,
      initState: {
        text: "안녕하세요",
        ok: true,
      },
    });

    const sideBar = new SideBar({
      $target,
      initialState: initialState.root,
      onDocumentClick: () => {
        this.route();
      },
      displayAlert: ({ text, ok }) => {
        myAlert.setState({ text, ok });
      },
    });

    const $contentContainer = $create("div");
    $contentContainer.classList.add("content-container");

    const $editor = $create("div");
    $editor.classList.add("editor");
    $contentContainer.appendChild($editor);

    const editor = new Editor({
      $target: $editor,
      initialState: {
        info: {
          id: "",
          title: "",
          content: "",
          documents: [],
          createdAt: "",
          updatedAt: "",
        },
        flatRoot: initialState.flatRoot,
      },
      FuncAppRoute: () => {
        this.route();
      },
      displayAlert: ({ text, ok }) => {
        myAlert.setState({ text, ok });
      },
    });

    this.state = initialState;
    this.myAlert = myAlert;
    this.sideBar = sideBar;
    this.editor = editor;
    this.setEvent();
    this.route();
    $target.appendChild($contentContainer);
  }

  setEvent() {
    window.addEventListener("popstate", () => {
      this.route();
    });
  }

  // 제목 검색을 위해 depth 1로 펼치기
  makeFlatState(input) {
    return input.reduce((accArr, docElement) => {
      const { id, title, documents } = docElement;

      accArr = [...accArr, { id, title }];
      if (documents.length) {
        accArr = [...accArr, ...this.makeFlatState(documents)];
      }
      return accArr;
    }, []);
  }

  async setState(documentId) {
    try {
      const root = await getDocs();

      this.state = {
        ...this.state,
        root,
        flatRoot: this.makeFlatState(root),
      };

      this.sideBar.setState(this.state.root);
      this.editor.setState({
        documentId,
        flatRoot: this.state.flatRoot,
      });
    } catch (e) {
      this.myAlert.setState({
        text: "전체 문서를 가져오지 못했습니다.",
        ok: false,
      });
    }
  }

  route() {
    const { pathname } = location;

    if (pathname.indexOf("/documents") === 0) {
      const documentId = pathname.split("/")[2];
      this.setState(documentId);
    } else {
      // /documents로 시작안할 때
      this.setState(null);
    }
  }
}
