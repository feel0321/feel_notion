import { $create, $select } from "../../utils/dom.js";
import { NO_TITLE_MESSAGE } from "../../utils/constants.js";

export default class EditorChildren {
  constructor({ $target, initialState, FuncAppRoute }) {
    const $editorChildren = $create("ul");
    $editorChildren.className = "editor-children";

    this.state = initialState;
    this.FuncAppRoute = FuncAppRoute;
    this.$editorChildren = $editorChildren;
    this.setEvent();
    this.render();
    $target.appendChild($editorChildren);
  }

  setEvent() {
    // Editor 하단 자식 document 클릭시 이동
    this.$editorChildren.addEventListener("click", (e) => {
      const { classList } = e.target;

      if (classList.contains("document")) {
        const { id } = e.target.dataset;
        history.pushState(null, null, `/documents/${id}`);
        this.FuncAppRoute();
        $select(".editor-content-container").scroll(0, 0);
      }
    });
  }

  setState(nextState) {
    if (nextState?.length) {
      this.state = nextState;
    } else {
      this.state = [];
    }
    this.render();
  }

  render() {
    this.$editorChildren.innerHTML = this.state
      .map(
        ({ id, title }) =>
          `<li class="document" data-id=${id}>${title || NO_TITLE_MESSAGE}</li>`
      )
      .join("");
  }
}
