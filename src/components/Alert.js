import { $create } from "../../utils/dom.js";

export default function Alert({ $target, initState }) {
  const $alertDiv = $create("div");
  $target.appendChild($alertDiv);
  $alertDiv.className = "alert";

  const $alertTopDiv = $create("div");
  $alertDiv.appendChild($alertTopDiv);
  $alertTopDiv.className = "alert-top-div";

  const $alertText = $create("div");
  $alertDiv.appendChild($alertText);

  const $alertCloseButton = $create("div");
  $alertTopDiv.appendChild($alertCloseButton);
  $alertCloseButton.className = "alert-close-button";
  $alertCloseButton.textContent = "X";

  this.state = initState;

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    const { text, ok } = this.state;

    $alertText.textContent = text;
    $alertDiv.style.backgroundColor = ok ? "burlywood" : "brown";
    $alertDiv.style.display = "flex";

    // 오류가 발생한 경우 자동으로 닫히지 않음
    if (ok) {
      setTimeout(() => {
        $alertDiv.style.display = "none";
      }, 2000);
    }
  };

  $alertCloseButton.addEventListener("click", () => {
    $alertDiv.style.display = "none";
  });
}
