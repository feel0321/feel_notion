import { $create } from "../../utils/dom.js";

export default function Button({ $target, initText, onClick }) {
  const $button = $create("button");
  $target.appendChild($button);

  this.render = () => {
    $button.innerText = initText;
  };

  this.render();

  $button.addEventListener("click", onClick);
}
