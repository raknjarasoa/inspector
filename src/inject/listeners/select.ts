import { activeNgComponent } from ".";
import { APP_EXT_INPUT_SELECT_ID, APP_EXT_OUTPUT_SELECT_ID } from "../../constants";
import { getProperties, updateViewContent } from "../shared";

/**
 *As soon as tooltip is shown, start listening for input/output select changes.
 *
 */
export function listenForSelect(): void {
  [APP_EXT_OUTPUT_SELECT_ID, APP_EXT_INPUT_SELECT_ID].forEach((id) => {
    const selectElement = document.getElementById(id);
    if (selectElement) {
      selectElement.addEventListener("change", changeListener());
    }
  });
}

export function stopListenForSelect(): void {
  [APP_EXT_OUTPUT_SELECT_ID, APP_EXT_INPUT_SELECT_ID].forEach((id) => {
    const selectElement = document.getElementById(id);
    if (selectElement) {
      selectElement.removeEventListener("change", changeListener());
    }
  });
}

function changeListener(): (this: HTMLElement, ev: Event) => any {
  return (event) => {
    const element = event.target as HTMLInputElement;
    const properties = getProperties(activeNgComponent);
    updateViewContent(element, properties, activeNgComponent);
  };
}
