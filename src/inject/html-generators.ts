// import { renderFile } from "ejs";
import { getProperties } from "./shared";
import {
  APP_EXT_CONST,
  APP_EXT_PROP_EMIT_BUTTON_CLASS,
  APP_EXT_BUTTON_PROP,
  APP_EXT_PROP_VALUE_SPAN_CLASS,
  APP_EXT_PROP_VALUE_INPUT_CLASS,
  APP_EXT_PROP_VALUE_BUTTON_CLASS,
} from "../shared/constants";

export function buildHTML(nGComponent: any, attrValue: string) {
  const properties = getProperties(nGComponent);
  //   let html = renderFile('./index.html', { name: nGComponent.constructor.name }, (err, str)=>{

  //   });
  let html = `<h4><strong>Component:</strong>${nGComponent.constructor.name}</h4>`;
  html += `<h4><strong>Selector:</strong>${nGComponent.constructor.decorators[0].args[0].selector}</h4>`;
  html += "<hr/>";

  html += `<select class="select-class" ${APP_EXT_CONST}="${attrValue}">
            <option value="">--Please choose a property--</option>`;
  for (const prop in properties) {
    html += `<option value="${prop}">${prop}</option>`;
  }
  html += "</select>";

  html += "<div class='select-next-div'></div>";
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
  let html = value;
  switch (value.constructor.name) {
    case "EventEmitter_":
      html = `<input type="text"><button class="${APP_EXT_PROP_EMIT_BUTTON_CLASS}" ${APP_EXT_BUTTON_PROP}="${prop}">Emit</button>`;
      break;
    case "String":
    case "Number":
      html = `
              <span class="${APP_EXT_PROP_VALUE_SPAN_CLASS}">${value}</span>
              <input type="text" class="${APP_EXT_PROP_VALUE_INPUT_CLASS}" value="${value}">
              <button class="${APP_EXT_PROP_VALUE_BUTTON_CLASS}" ${APP_EXT_BUTTON_PROP}="${prop}">✏️</button>
              `;
      break;
    default:
      html = value;
      break;
  }
  return html;
}
