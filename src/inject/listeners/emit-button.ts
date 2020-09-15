import { activeNgComponent } from ".";
import {
  APP_EXT_PROP_EMIT_BUTTON_ID,
  APP_EXT_BUTTON_PROP,
  APP_EXT_PROP_OUTPUT_VALUE,
  APP_EXT_PROP_OUTPUT_JSON_ID,
  APP_EXT_PROP_OBJECT_VALUE_ERROR,
} from "../../constants";

/**
 * As soon as tooltip is shown, we can start listening to `emit buttons`, so that we can
 * capture events and update the component.
 *
 */
export function listenForEmit(): void {
  const emitButton = document.getElementById(APP_EXT_PROP_EMIT_BUTTON_ID);
  if (emitButton) {
    emitButton.addEventListener("click", clickListener());
  }
}

export function stopListenForEmit(): void {
  const emitButton = document.getElementById(APP_EXT_PROP_EMIT_BUTTON_ID);
  if (emitButton) {
    emitButton.removeEventListener("click", clickListener());
  }
}

function clickListener(): (this: HTMLElement, ev: MouseEvent) => any {
  return (event) => {
    const prop = (event.target as Element).getAttribute(APP_EXT_BUTTON_PROP);
    if (activeNgComponent && prop) {
      const element = document.getElementById(APP_EXT_PROP_OUTPUT_VALUE) as HTMLInputElement;
      const inputValue = element && element.value;
      const isJSON = (document.getElementById(APP_EXT_PROP_OUTPUT_JSON_ID) as HTMLInputElement).checked;
      if (inputValue && isJSON) {
        const errorElement = document.getElementById(APP_EXT_PROP_OBJECT_VALUE_ERROR);
        try {
          activeNgComponent[prop].emit(JSON.parse(inputValue));
          if (errorElement) {
            errorElement.innerText = "";
          }
        } catch (e) {
          if (errorElement) {
            errorElement.innerText = "⚠️ Error while parsing JSON!";
          }
        }
      } else if (inputValue) {
        activeNgComponent[prop].emit(inputValue);
      }
    }
  };
}
