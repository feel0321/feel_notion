import { $create } from "../../utils/dom.js";
import { NO_TITLE_MESSAGE } from "../../utils/constants.js";
import Button from "./Button.js";
import { deleteDoc, postDoc } from "../request/index.js";

export default class SideBarChildren {
  constructor({ $target, initialState, onDocumentClick, displayAlert }) {
    const $div = $create("div");
    $div.className = "side-bar-content";

    this.state = initialState;
    this.onDocumentClick = onDocumentClick;
    this.displayAlert = displayAlert;
    this.$div = $div;
    this.setEvent();
    this.render();
    $target.appendChild($div);
  }

  setEvent() {
    this.$div.addEventListener("click", (e) => {
      const { classList, dataset, parentElement } = e.target;
      // url 변경 + 리로드
      if (classList.contains("document")) {
        history.pushState(null, null, `/documents/${dataset.id}`);
        this.onDocumentClick();
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

  setState(nextState) {
    this.state = nextState;
    this.render();
  }

  render() {
    this.$div.innerHTML = this.createContentBlock(this.state, 0);

    this.$div.querySelectorAll(".document").forEach(($element) => {
      const { id } = $element.dataset;

      new Button({
        $target: $element,
        initText: "+",
        onClick: async () => {
          try {
            const data = await postDoc("새 글", id);
            this.displayAlert({
              text: `${id}번 문서 아래에 새 글을 작성합니다.`,
              ok: true,
            });
            history.pushState(null, null, `/documents/${data.id}`);
            this.onDocumentClick();
          } catch (e) {
            this.displayAlert({
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
            this.displayAlert({ text: `${id}번 글을 삭제했습니다.`, ok: true });
            if (id === documentId) {
              history.pushState(null, null, "/");
            }
            this.onDocumentClick();
          } catch (e) {
            this.displayAlert({
              text: `${idx}번 글을 삭제할 수 없습니다.`,
              ok: false,
            });
          }
        },
      });
    });
  }

  createContentBlock(input, depth) {
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
                documents.length
                  ? this.createContentBlock(documents, depth + 1)
                  : ""
              }
            `;
          })
          .join("")}
        </div>
      `;
  }
}
