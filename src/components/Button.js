import { $create } from "../../utils/dom.js";

export default class Button {
  constructor({ $target, initText, onClick }) {
    const $button = $create("button");

    this.$button = $button;
    this.text = initText;
    this.onClick = onClick;
    this.setEvent();
    this.render();
    $target.appendChild($button);
  }

  setEvent() {
    this.$button.addEventListener("click", this.onClick);
  }

  render() {
    this.$button.innerText = this.text;
  }
}
