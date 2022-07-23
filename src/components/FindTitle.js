import { $create, $select } from "../../utils/dom.js";

export default function FindTitle({ $target, initState }) {
  this.state = initState;

  const $div = $create("div");
  $div.className = "find-title none-data";

  $target.appendChild($div);

  this.setState = ({ nextState, left, top }) => {
    if (nextState) {
      this.state = nextState;
      $div.style.left = `${left}px`;
      $div.style.top = `${top}px`;
      $div.classList.remove("none-data");
      this.render();
    } else {
      $div.classList.add("none-data");
    }
  };

  this.render = () => {
    $div.innerHTML = `
      <ul>
        ${this.state
          .map(
            ({ id, title }) =>
              `<li class="document" data-id="${id}">${title}</li>`
          )
          .join("")}
      </ul>
    `;
  };

  $div.addEventListener("click", (e) => {
    if (e.target.classList.contains("document")) {
      const { anchorNode } = window.getSelection();
      const $contentContainer = $select(".editor-content-container");

      for (const element of $contentContainer.children) {
        // 제목 명령어가 있으면 a태그로 변경
        if (element.innerHTML.includes("/제목 ")) {
          const id = anchorNode.parentElement.dataset.id;

          element.setAttribute("contenteditable", true);
          element.innerHTML = `
            <div contentEditable="false">
              <a class="anchor" data-id="${id}">${anchorNode.textContent}</a>
            </div>
          `;
          const nextElement = element.nextElementSibling;

          // 다음 element가 있으면 focus
          if (nextElement) {
            window.getSelection().collapse(nextElement, 0);
          }
          // 없으면 기본 블록을 만들어서 focus
          else {
            const $newDiv = $create("div");
            $newDiv.className = "editor-content";
            element.parentElement.appendChild($newDiv);
            window.getSelection().collapse($newDiv, 0);
          }
          break;
        }
      }
      this.setState({ nextState: null });
    }
  });
}
