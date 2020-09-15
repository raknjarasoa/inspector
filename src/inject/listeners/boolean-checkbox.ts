import { activeNgComponent } from ".";
import { APP_EXT_BUTTON_PROP, APP_EXT_PROP_BOOLEAN_ID } from "../../constants";

declare const ng: any;

/**
 * As soon as tooltip is shown, we can start listening to `boolean checkboxes`, so that we can
 * capture events and update the component.
 *
 */
export function listenForBoolean(): void {
  const checkbox = document.getElementById(APP_EXT_PROP_BOOLEAN_ID);
  if (checkbox) {
    checkbox.addEventListener("change", changeListener());
  }
}

/**
 * As soon as tooltip is shown, we can start listening to `boolean checkboxes`, so that we can
 * capture events and update the component.
 *
 */
export function stopListenForBoolean(): void {
  const checkbox = document.getElementById(APP_EXT_PROP_BOOLEAN_ID);
  if (checkbox) {
    checkbox.removeEventListener("change", changeListener());
  }
}

function changeListener(): (this: HTMLElement, ev: Event) => any {
  return (event) => {
    const element = event.target as HTMLInputElement;
    const prop = element.getAttribute(APP_EXT_BUTTON_PROP);
    if (activeNgComponent && prop) {
      const checkboxValue = element.checked;
      activeNgComponent[prop] = checkboxValue;
      ng.applyChanges(activeNgComponent);
    }
  };
}
