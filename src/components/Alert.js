import { $create } from "../../utils/dom.js";

export default class Alert {
  constructor({ $target, initialState }) {
    const $alertDiv = $create("div");
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

    this.state = initialState;
    this.$alertDiv = $alertDiv;
    this.$alertText = $alertText;
    this.$alertCloseButton = $alertCloseButton;
    this.setEvent();
    $target.appendChild($alertDiv);
  }

  setEvent() {
    this.$alertCloseButton.addEventListener("click", () => {
      this.$alertDiv.style.display = "none";
    });
  }

  setState(nextState) {
    this.state = nextState;
    this.render();
  }

  render() {
    const { text, ok } = this.state;

    this.$alertText.textContent = text;
    this.$alertDiv.style.backgroundColor = ok ? "burlywood" : "brown";
    this.$alertDiv.style.display = "flex";

    // 오류가 발생한 경우 자동으로 닫히지 않음
    if (ok) {
      setTimeout(() => {
        this.$alertDiv.style.display = "none";
      }, 2000);
    }
  }
}
