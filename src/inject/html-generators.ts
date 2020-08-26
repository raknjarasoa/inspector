import { render } from "ejs";
import Prism from "prismjs";
import { getProperties } from "./shared";
import {
  APP_EXT_PROP_EMIT_BUTTON_ID,
  APP_EXT_BUTTON_PROP,
  APP_EXT_PROP_VALUE_INPUT_CLASS,
  APP_EXT_PROP_VALUE_BUTTON_CLASS,
  TOOLTIP_HTML,
  APP_EXT_PROP_OUTPUT_JSON_ID,
  APP_EXT_PROP_BOOLEAN_ID,
  APP_EXT_PROP_OBJECT_BUTTON_ID,
  APP_EXT_PROP_OBJECT_VALUE,
  APP_EXT_PROP_OBJECT_VALUE_ERROR,
  APP_EXT_CONST,
  APP_EXT_PROP_OUTPUT_VALUE,
  APP_EXT_TOGGLE_BTN_ID,
} from "../shared/constants";

export function buildHTML(nGComponent: any, attrValue: string): string {
  const properties = getProperties(nGComponent);

  let html = render(TOOLTIP_HTML(), {
    name: nGComponent.constructor.name,
    selector: nGComponent.constructor.decorators[0].args[0].selector,
    propertySelectAttrValue: attrValue,
    properties,
  });
  return html;
}

export function buildNotFoundHTML(): string {
  let html = `
  <div class="${APP_EXT_CONST}">
  <div class="position-absolute" style="top: 0px;right: 0px;z-index: 1;">
    <button type="button" class="btn btn-sm" aria-label="Close" id="chrome-ext-ng-properties-close-btn" title="Close inspector">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6c757d" width="24px" height="24px"><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>
    </button>
  </div>
  <div class="container-fluid pb-3 position-relative">
    <h5>Not an Angular component</h5>
    <p>We couldn't find any Angular component for corresponding element.</p>
  </div>
  <div class="position-absolute" style="bottom: 4px; right: 4px;">
  <img
    style="display: inline"
    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACnElEQVQ4T42TW0gUYRTH/7MXb+stL2yaq9viJYmySBRKaO0h8iExNHoKrISSihUCkXqo1CAo2B4kvCQGvQSCRBdqoQcfVpBQyFBRTBfZzSx3d3ZnJ2fGucV828ruUtA8nfnOOb9zvvP9D4V/fLmw5joOOp3M+gb/gr3b7Yc/8rdQKulQ327tu9FW2v3AqEsxaT52zkdCdlSBmeAGesaFJ0MAlFgeATQUtNivVz4dzUspsiVXiQHizwPKj5WhXz2XZ6WPbg2gc9lVOT7AVAak7AGMWYAcpCFsyWDXJLCrUgK/lbboSAcuu6rGPDojUNYGcJtAfi3gGw/A3JgGkVEw3xuGGsdopS0UAXywyyIFnUGzrRcARQQCM4DlHMB5Ikgv1kPmVYTnRayNsqSWAlk4T1vTCGCiIbxpMmSbNbv8CsB6gEwrYMgAjBkcNt7xEPwy8utSsdAfJgBGDXovhWpKCWCwds69P/PwCS2h8DiQdwyADAg0kFHIg/VI4HwS/NM7YBZF0s2yOOu6zbacIYCuqhFnU1FHl3Z/20UgtAiIIcB8EuC9DLbcArgNGcZsHRmmGFbwhhu595zvvU8Ap83tZ29Vj73W7MpOIK0AEIIAVEAMssipNoJZEhH5KmHtWXQGzkhno1t6O0kAFTmHbANHv6wSwLXoDLIrAMoAUPI2tqaiHZjKDFgdjgKu0g3Ffqx//6PEknSX3bsde8qSZiDLBvA/gcx9HEILIlQRWHrM7OqglbakagLdlfJY/crn4vTymv9Rok9e+eRgTtVrsQm7UJVVW/XoyOR0qt6UGwPFS5lTWf+dUEvdOpY9CbuQXLVpb0eb48DwSwqUXgOoUCTntqN5Snj1Pjk2eRsT/DcrBh+y3m/sGN/Xn5wY+/8NCHEWIcyJZ9sAAAAASUVORK5CYII="
    alt="ngneat logo"
  /><small
    ><small><strong>inspector</strong></small></small
  >
</div>
  </div>
  `;
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
      case "Object": {
        const codeHtml = Prism.highlight(
          JSON.stringify(value, null, 2),
          Prism.languages.javascript,
          "javascript"
        );
        html = `
        <div class="mb-1">
          <pre id="${APP_EXT_PROP_OBJECT_VALUE}" contenteditable="true" class="language-markup"><code class="language-javascript">${codeHtml}</code></pre>
        </div>
        <span class="form-text text-danger mb-1" id="${APP_EXT_PROP_OBJECT_VALUE_ERROR}"></span>
        <div class="text-right mb-2">
          <button class="btn btn-outline-secondary px-1" type="button" id="${APP_EXT_PROP_OBJECT_BUTTON_ID}" ${APP_EXT_BUTTON_PROP}="${prop}">Update</button>
        </div>
        `;
        break;
      }
      case "Array": {
        const codeHtml = Prism.highlight(
          JSON.stringify(value, null, 2),
          Prism.languages.javascript,
          "javascript"
        );
        html = `
        <div class="mb-1">
          <pre id="${APP_EXT_PROP_OBJECT_VALUE}" contenteditable="true" class="language-markup"><code class="language-javascript">${codeHtml}</code></pre>
        </div>
        <span class="form-text text-danger mb-1" id="${APP_EXT_PROP_OBJECT_VALUE_ERROR}"></span>
        <div class="text-right mb-2">
          <button class="btn btn-outline-secondary px-1" type="button" id="${APP_EXT_PROP_OBJECT_BUTTON_ID}" ${APP_EXT_BUTTON_PROP}="${prop}">Update</button>
        </div>
        `;
        break;
      }
      default:
        html = `<p> ⚠️ ${value.constructor.name} is not supported</p>`;
        break;
    }
    return html;
  }
  return "";
}
