import {
  APP_EXT_PROP_OUTPUT_VALUE,
  APP_EXT_PROP_OBJECT_VALUE_ERROR,
  APP_EXT_PROP_OUTPUT_JSON_ID,
  APP_EXT_PROP_EMIT_BUTTON_ID,
  APP_EXT_BUTTON_PROP,
} from "../../../constants";

export function evenEmitterHTML(prop: any): string {
  return `
          <div class="mb-2">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">${prop}</span>
              </div>
              <textarea class="form-control" placeholder="Property value" aria-label="Property value" id="${APP_EXT_PROP_OUTPUT_VALUE}"></textarea>
            </div>
            <span class="form-text text-danger mb-1" id="${APP_EXT_PROP_OBJECT_VALUE_ERROR}"></span>
          </div>
          <div class="row">
            <div class="col-auto mb-2">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="${APP_EXT_PROP_OUTPUT_JSON_ID}">
                <label class="custom-control-label" for="${APP_EXT_PROP_OUTPUT_JSON_ID}">JSON</label>
              </div>
            </div>
            <div class="col-auto ml-auto mb-2">
              <button class="btn btn-outline-secondary" id="${APP_EXT_PROP_EMIT_BUTTON_ID}" type="button" ${APP_EXT_BUTTON_PROP}="${prop}">Emit</button>
            </div>
          </div>`;
}
