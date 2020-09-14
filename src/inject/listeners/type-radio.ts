import {
  APP_EXT_INPUT_SELECT_ID,
  APP_EXT_OUTPUT_SELECT_ID,
  APP_EXT_PROP_TYPE_RADIO_NAME,
} from "../../constants";
import { getProperties, updateViewContent } from "../shared";

/**
 * As soon as tooltip is shown, we can start listening to `radio buttons`, so that we can
 * capture events and update the component.
 *
 */
export function listenForRadio(activeNgComponent: any): void {
  const radioButtons = document.querySelectorAll(
    "input[name='" + APP_EXT_PROP_TYPE_RADIO_NAME + "']"
  );
  radioButtons.forEach((radioButton) => {
    const element = radioButton as HTMLInputElement;
    element.addEventListener("change", changeListener(activeNgComponent));
  });
}

export function stopListenForRadio(activeNgComponent: any): void {
  const radioButtons = document.querySelectorAll(
    "input[name='" + APP_EXT_PROP_TYPE_RADIO_NAME + "']"
  );
  radioButtons.forEach((radioButton) => {
    const element = radioButton as HTMLInputElement;
    element.removeEventListener("change", changeListener(activeNgComponent));
  });
}

function changeListener(
  activeNgComponent: any
): (this: HTMLInputElement, ev: Event) => any {
  return (event) => {
    const targetElement = event.target as HTMLInputElement;
    if (targetElement.checked) {
      const value = targetElement.value;
      const inputSelect = document.getElementById(
        APP_EXT_INPUT_SELECT_ID
      ) as HTMLInputElement;
      const outputSelect = document.getElementById(
        APP_EXT_OUTPUT_SELECT_ID
      ) as HTMLInputElement;
      if (value === "input") {
        inputSelect.disabled = false;
        outputSelect.disabled = true;
        const properties = getProperties(activeNgComponent);
        updateViewContent(inputSelect, properties, true);
      } else {
        inputSelect.disabled = true;
        outputSelect.disabled = false;
        const properties = getProperties(activeNgComponent);
        updateViewContent(outputSelect, properties, true);
      }
    }
  };
}
