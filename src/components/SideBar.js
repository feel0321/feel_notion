import { $create } from "../../utils/dom.js";
import Button from "./Button.js";
import SideBarChildren from "./SideBarChildren.js";
// import { request } from "../api/api.js";
import { postDoc } from "../request/index.js";

export default function SideBar({
  $target,
  initialState,
  onDocumentClick,
  displayAlert,
}) {
  const $sideBarContainer = $create("div");
  $target.appendChild($sideBarContainer);
  $sideBarContainer.classList.add("side-bar-container");

  const $sideBarHome = $create("div");
  $sideBarHome.className = "document";
  $sideBarContainer.appendChild($sideBarHome);
  $sideBarHome.textContent = "home ";

  $sideBarHome.addEventListener("click", () => {
    history.pushState(null, null, "/");
    onDocumentClick();
  });

  this.render = () => {
    new Button({
      $target: $sideBarHome,
      initText: "+",
      onClick: async () => {
        try {
          const data = await postDoc("새 글");
          displayAlert({ text: "새 글을 작성합니다.", ok: true });
          history.pushState(null, null, `/documents/${data.id}`);
          onDocumentClick();
        } catch (e) {
          displayAlert({ text: "새 글 작성에 실패했습니다.", ok: false });
        }
      },
    });
  };

  this.render();

  const sideBarContent = new SideBarChildren({
    $target: $sideBarContainer,
    initialState,
    onDocumentClick,
    displayAlert,
  });

  this.state = initialState;

  this.setState = (nextState) => {
    sideBarContent.setState(nextState);
  };
}
