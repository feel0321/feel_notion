import { $create } from "../../utils/dom.js";
import Button from "./Button.js";
import SideBarChildren from "./SideBarChildren.js";
import { postDoc } from "../request/index.js";

export default class SideBar {
  constructor({ $target, initialState, onDocumentClick, displayAlert }) {
    const $sideBarContainer = $create("div");
    $sideBarContainer.classList.add("side-bar-container");

    const $sideBarHome = $create("div");
    $sideBarHome.className = "document";
    $sideBarContainer.appendChild($sideBarHome);
    $sideBarHome.textContent = "home ";

    this.state = initialState;
    this.onDocumentClick = onDocumentClick;
    this.displayAlert = displayAlert;
    this.$sideBarHome = $sideBarHome;
    this.setEvent();
    this.render();
    $target.appendChild($sideBarContainer);

    const sideBarContent = new SideBarChildren({
      $target: $sideBarContainer,
      initialState,
      onDocumentClick,
      displayAlert,
    });
    this.sideBarContent = sideBarContent;
  }

  setEvent() {
    this.$sideBarHome.addEventListener("click", () => {
      history.pushState(null, null, "/");
      this.onDocumentClick();
    });
  }

  setState(nextState) {
    this.sideBarContent.setState(nextState);
  }

  render() {
    new Button({
      $target: this.$sideBarHome,
      initText: "+",
      onClick: async () => {
        try {
          const data = await postDoc("새 글");
          this.displayAlert({ text: "새 글을 작성합니다.", ok: true });
          history.pushState(null, null, `/documents/${data.id}`);
          this.onDocumentClick();
        } catch (e) {
          this.displayAlert({ text: "새 글 작성에 실패했습니다.", ok: false });
        }
      },
    });
  }
}
