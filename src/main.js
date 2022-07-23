import { $select } from "../utils/dom.js";
import App from "./components/App.js";

const $app = $select(".app");

new App({
  $target: $app,
  initialState: {
    root: [],
    flatRoot: [],
  },
});
