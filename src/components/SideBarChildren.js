import { $create } from "../../utils/dom.js";
import { NO_TITLE_MESSAGE } from "../../utils/constants.js";
import Button from "./Button.js";
import { deleteDoc, postDoc } from "../request/index.js";

export default function SideBarChildren({
  $target,
  initialState,
  onDocumentClick,
  displayAlert,
}) {
  const $div = $create("div");
  $div.className = "side-bar-content";
  $target.appendChild($div);

  this.state = initialState;

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  function createContentBlock(input, depth) {
    return `
      <div class='side-bar-content-block'>
        ${input
          .map((docElement, idx) => {
            const { id, title, documents } = docElement;

            return `
              <div class="document ${depth}_${idx}" data-id="${id}">
                ${
                  documents.length
                    ? `<span class="documents-open-button hide">V</span>`
                    : ""
                }
                ${title || NO_TITLE_MESSAGE}
              </div>
              ${
                documents.length ? createContentBlock(documents, depth + 1) : ""
              }
            `;
          })
          .join("")}
        </div>
      `;
  }

  this.render = () => {
    $div.innerHTML = createContentBlock(this.state, 0);

    $div.querySelectorAll(".document").forEach(($element) => {
      const { id } = $element.dataset;

      new Button({
        $target: $element,
        initText: "+",
        onClick: async () => {
          try {
            const data = await postDoc("새 글", id);
            displayAlert({
              text: `${id}번 문서 아래에 새 글을 작성합니다.`,
              ok: true,
            });
            history.pushState(null, null, `/documents/${data.id}`);
            onDocumentClick();
          } catch (e) {
            displayAlert({
              text: `${id}번 문서 아래에 새 글을 작성할 수 없습니다.`,
              true: false,
            });
          }
        },
      });

      new Button({
        $target: $element,
        initText: "-",
        onClick: async () => {
          try {
            const documentId = location.pathname.split("/")[2];
            await deleteDoc(id);
            displayAlert({ text: `${id}번 글을 삭제했습니다.`, ok: true });
            if (id === documentId) {
              history.pushState(null, null, "/");
            }
            onDocumentClick();
          } catch (e) {
            displayAlert({
              text: `${idx}번 글을 삭제할 수 없습니다.`,
              ok: false,
            });
          }
        },
      });
    });
  };

  $div.addEventListener("click", (e) => {
    const { classList, dataset, parentElement } = e.target;

    // url 변경 + 리로드
    if (classList.contains("document")) {
      history.pushState(null, null, `/documents/${dataset.id}`);
      onDocumentClick();
    }

    // documents tree 접기 / 펼치기
    if (classList.contains("documents-open-button")) {
      if (parentElement.classList.contains("hide")) {
        parentElement.classList.remove("hide");
        e.target.textContent = "V";
      } else {
        parentElement.classList.add("hide");
        e.target.textContent = ">";
      }
    }
  });
}
