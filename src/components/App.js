import { $create } from "../../utils/dom.js";
import Editor from "./Editor.js";
import SideBar from "./SideBar.js";
import Alert from "./Alert.js";
import { getDocs } from "../request/index.js";

export default function App({ $target, initialState }) {
  this.state = initialState;

  const myAlert = new Alert({
    $target,
    initState: {
      text: "안녕하세요",
      ok: true,
    },
  });

  const sideBar = new SideBar({
    $target,
    initialState: this.state.root,
    onDocumentClick: () => {
      this.route();
    },
    displayAlert: ({ text, ok }) => {
      myAlert.setState({ text, ok });
    },
  });

  const $contentContainer = $create("div");
  $target.appendChild($contentContainer);
  $contentContainer.classList.add("content-container");

  const $editor = $create("div");
  $contentContainer.appendChild($editor);
  $editor.classList.add("editor");

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
      flatRoot: this.state.flatRoot,
    },
    FuncAppRoute: () => {
      this.route();
    },
    displayAlert: ({ text, ok }) => {
      myAlert.setState({ text, ok });
    },
  });

  // 제목 검색을 위해 depth 1로 펼치기
  function makeFlatState(input) {
    return input.reduce((accArr, docElement) => {
      const { id, title, documents } = docElement;

      accArr = [...accArr, { id, title }];
      if (documents.length) {
        accArr = [...accArr, ...makeFlatState(documents)];
      }
      return accArr;
    }, []);
  }

  this.setState = async (documentId) => {
    try {
      const root = await getDocs();

      this.state = {
        ...this.state,
        root,
        flatRoot: makeFlatState(root),
      };

      sideBar.setState(this.state.root);
      editor.setState({
        documentId,
        flatRoot: this.state.flatRoot,
      });
    } catch (e) {
      myAlert.setState({ text: "전체 문서를 가져오지 못했습니다.", ok: false });
    }
  };

  this.route = () => {
    const { pathname } = location;

    if (pathname.indexOf("/documents") === 0) {
      const documentId = pathname.split("/")[2];
      this.setState(documentId);
    } else {
      // /documents로 시작안할 때
      this.setState(null);
    }
  };

  this.route();

  window.addEventListener("popstate", this.route);
}
