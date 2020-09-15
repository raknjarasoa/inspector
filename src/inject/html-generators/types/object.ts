import Prism from "prismjs";
import {
  APP_EXT_PROP_OBJECT_VALUE,
  APP_EXT_PROP_OBJECT_VALUE_ERROR,
  APP_EXT_PROP_OBJECT_BUTTON_ID,
  APP_EXT_BUTTON_PROP,
} from "../../../constants";

export function objectHTML(value: string, prop: string): string {
  const codeHtml = Prism.highlight(JSON.stringify(value, null, 2), Prism.languages.javascript, "javascript");
  return `
      <div class="mb-1">
        <pre id="${APP_EXT_PROP_OBJECT_VALUE}" contenteditable="true" class="language-markup"><code class="language-javascript">${codeHtml}</code></pre>
      </div>
      <span class="form-text text-danger mb-1" id="${APP_EXT_PROP_OBJECT_VALUE_ERROR}"></span>
      <div class="text-right mb-2">
        <button class="btn btn-outline-secondary px-1" type="button" id="${APP_EXT_PROP_OBJECT_BUTTON_ID}" ${APP_EXT_BUTTON_PROP}="${prop}">Update</button>
      </div>
      `;
}
