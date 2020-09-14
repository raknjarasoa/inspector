import {
  APP_EXT_PROP_VALUE_INPUT_CLASS,
  APP_EXT_PROP_VALUE_BUTTON_ID,
  APP_EXT_BUTTON_PROP,
} from "../../../constants";

export function numberStringHTML(prop: any, value: any): string {
  return `
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">${prop}</span>
            </div>
            <input type="text" class="form-control ${APP_EXT_PROP_VALUE_INPUT_CLASS}" placeholder="Property value" aria-label="Property value" aria-describedby="property-value" value="${value}">
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" id="${APP_EXT_PROP_VALUE_BUTTON_ID}" type="button" id="property-value" ${APP_EXT_BUTTON_PROP}="${prop}">Edit</button>
            </div>
          </div>`;
}
