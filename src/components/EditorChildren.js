import { $create, $select } from "../../utils/dom.js";
import { NO_TITLE_MESSAGE } from "../../utils/constants.js";

export default function EditorChildren({
  $target,
  initialState,
  FuncAppRoute,
}) {
  const $editorChildren = $create("ul");
  $target.appendChild($editorChildren);
  $editorChildren.className = "editor-children";

  this.state = initialState;

  this.setState = (nextState) => {
    if (nextState?.length) {
      this.state = nextState;
    } else {
      this.state = [];
    }
    this.render();
  };

  this.render = () => {
    $editorChildren.innerHTML = this.state
      .map(
        ({ id, title }) =>
          `<li class="document" data-id=${id}>${title || NO_TITLE_MESSAGE}</li>`
      )
      .join("");
  };

  this.render();

  // Editor 하단 자식 document 클릭시 이동
  $editorChildren.addEventListener("click", (e) => {
    const { classList } = e.target;

    if (classList.contains("document")) {
      const { id } = e.target.dataset;
      history.pushState(null, null, `/documents/${id}`);
      FuncAppRoute();
      $select(".editor-content-container").scroll(0, 0);
    }
  });
}
