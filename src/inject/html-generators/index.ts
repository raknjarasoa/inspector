import { render } from "ejs";
import { getProperties } from "../shared";
import { arrayHTML } from "./types/array";
import { tooltipHTML } from "./tooltip";
import { booleanHTML } from "./types/boolean";
import { evenEmitterHTML } from "./types/event-emitter";
import { numberStringHTML } from "./types/number-string";
import { objectHTML } from "./types/object";
import {
  APP_EXT_INPUT_SELECT_ID,
  APP_EXT_OUTPUT_SELECT_ID,
  APP_EXT_PROP_TYPE_RADIO_NAME,
  APP_EXT_PROP_VIEW_ID,
} from "../../constants";

export async function buildHTML(nGComponent: any, attrValue: string, runTimeData: RunTimeData): Promise<string> {
  const properties = getProperties(nGComponent);

  return render(await tooltipHTML(runTimeData), {
    name: nGComponent.constructor.name,
    selector: nGComponent.constructor.decorators[0].args[0].selector,
    propertySelectAttrValue: attrValue,
    properties,
    APP_EXT_PROP_TYPE_RADIO_NAME: APP_EXT_PROP_TYPE_RADIO_NAME,
    APP_EXT_INPUT_SELECT_ID: APP_EXT_INPUT_SELECT_ID,
    APP_EXT_PROP_VIEW_ID: APP_EXT_PROP_VIEW_ID,
    APP_EXT_OUTPUT_SELECT_ID: APP_EXT_OUTPUT_SELECT_ID,
  });
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
export function getPropertyHTML(prop: any, value: any, nGComponent: any): string {
  if (value.constructor && value.constructor.name) {
    let html = "";
    switch (value.constructor.name) {
      case "EventEmitter_":
        html = evenEmitterHTML(prop);
        break;
      case "String":
      case "Number":
        html = numberStringHTML(prop, value);
        break;
      case "Boolean":
        html = booleanHTML(value, prop);
        break;
      case "Object": {
        html = objectHTML(value, prop);
        break;
      }
      case "Array": {
        html = arrayHTML(value, prop);
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
