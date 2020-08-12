import { render } from "ejs";
import { getProperties } from "./shared";
import {
  APP_EXT_CONST,
  APP_EXT_PROP_EMIT_BUTTON_CLASS,
  APP_EXT_BUTTON_PROP,
  APP_EXT_PROP_VALUE_SPAN_CLASS,
  APP_EXT_PROP_VALUE_INPUT_CLASS,
  APP_EXT_PROP_VALUE_BUTTON_CLASS,
  TOOLTIP_HTML,
  APP_EXT_PROP_OUTPUT_JSON_ID,
  APP_EXT_PROP_BOOLEAN_ID,
} from "../shared/constants";

export function buildHTML(
  nGComponent: any,
  attrValue: string,
  runtimeData: runtimeData
): string {
  const properties = getProperties(nGComponent);

  // TODO: pass runtime css url from content_script as window.postmessage and pass it further to TOOLTIP_HTML

  let html = render(TOOLTIP_HTML(runtimeData), {
    name: nGComponent.constructor.name,
    selector: nGComponent.constructor.decorators[0].args[0].selector,
    propertySelectAttrValue: attrValue,
    properties,
  });
  return html;
}

/**
 * Generate `input` and `button` html elements based on ngComponent properties.
 * If property is `string` or `number`, simple text with edit button will be shown and
 * user can click on edit and then update the properties. If property is an `object` and if it's
 * an `EventEmitter`, then an `input` with `button{Emit}` will be shown, user can enter value
 * in input and click on Emit to simulate output.
 *
 * @param {*} prop
 * @param {*} value
 * @param {*} nGComponent
 * @returns {string}
 */
export function getPropertyHTML(
  prop: any,
  value: any,
  nGComponent: any
): string {
  if (value.constructor && value.constructor.name) {
    let html = "";
    switch (value.constructor.name) {
      case "EventEmitter_":
        html = `
        <div class="input-group mb-1">
          <div class="input-group-prepend">
            <span class="input-group-text">${prop}</span>
          </div>
          <textarea class="form-control" placeholder="Property value" aria-label="Property value" aria-describedby="property-emit-value"></textarea>
          <div class="input-group-append">
            <button class="btn btn-outline-secondary ${APP_EXT_PROP_EMIT_BUTTON_CLASS}" type="button" id="property-emit-value" ${APP_EXT_BUTTON_PROP}="${prop}">Emit</button>
          </div>
        </div>
        <div class="custom-control custom-checkbox mb-3">
          <input type="checkbox" class="custom-control-input" id="${APP_EXT_PROP_OUTPUT_JSON_ID}">
          <label class="custom-control-label" for="${APP_EXT_PROP_OUTPUT_JSON_ID}">JSON</label>
        </div>`;
        break;
      case "String":
      case "Number":
        html = `
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text">${prop}</span>
          </div>
          <input type="text" class="form-control ${APP_EXT_PROP_VALUE_INPUT_CLASS}" placeholder="Property value" aria-label="Property value" aria-describedby="property-value" value="${value}">
          <div class="input-group-append">
            <button class="btn btn-outline-secondary ${APP_EXT_PROP_VALUE_BUTTON_CLASS}" type="button" id="property-value" ${APP_EXT_BUTTON_PROP}="${prop}">Edit</button>
          </div>
        </div>`;
        break;
      case "Boolean":
        html = `
        <div class="custom-control custom-checkbox mb-3">`;
        if (value === true) {
          html += `<input type="checkbox" class="custom-control-input" id="${APP_EXT_PROP_BOOLEAN_ID}" ${APP_EXT_BUTTON_PROP}="${prop}" checked>`;
        } else {
          html += `<input type="checkbox" class="custom-control-input" id="${APP_EXT_PROP_BOOLEAN_ID}" ${APP_EXT_BUTTON_PROP}="${prop}">`;
        }
        html += `<label class="custom-control-label" for="${APP_EXT_PROP_BOOLEAN_ID}">Toggle</label></div>`;
        break;
      default:
        html = `<p> ⚠️ ${value.constructor.name} is not supported</p>`;
        break;
    }
    return html;
  }
  return "";
}
