import { APP_EXT_PROP_BOOLEAN_ID, APP_EXT_BUTTON_PROP } from "../../../constants";

export function booleanHTML(value: boolean, prop: string): string {
  let html = `<div class="custom-control custom-checkbox mb-3">`;
  if (value === true) {
    html += `<input type="checkbox" class="custom-control-input" id="${APP_EXT_PROP_BOOLEAN_ID}" ${APP_EXT_BUTTON_PROP}="${prop}" checked>`;
  } else {
    html += `<input type="checkbox" class="custom-control-input" id="${APP_EXT_PROP_BOOLEAN_ID}" ${APP_EXT_BUTTON_PROP}="${prop}">`;
  }
  html += `<label class="custom-control-label" for="${APP_EXT_PROP_BOOLEAN_ID}">Toggle</label></div>`;
  return html;
}
