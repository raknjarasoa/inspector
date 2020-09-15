import { activeNgComponent } from ".";
import { APP_EXT_BUTTON_PROP, APP_EXT_PROP_VALUE_BUTTON_ID } from "../../constants";

declare const ng: any;

/**
 * As soon as tooltip is shown, we can start listening to `edit / update buttons`, so that we can
 * capture events and update the component.
 *
 */
export function listenForValueChange(): void {
  const valueButton = document.getElementById(APP_EXT_PROP_VALUE_BUTTON_ID);
  if (valueButton) {
    valueButton.addEventListener("click", clickListener());
  }
}

export function stopListenForValueChange(): void {
  const valueButton = document.getElementById(APP_EXT_PROP_VALUE_BUTTON_ID);
  if (valueButton) {
    valueButton.removeEventListener("click", clickListener());
  }
}

function clickListener(): (this: HTMLElement, ev: MouseEvent) => any {
  return (event) => {
    const prop = (event.target as Element).getAttribute(APP_EXT_BUTTON_PROP);
    if (activeNgComponent && prop) {
      const parentElement = (event.target as Element).parentElement;
      const inputValue = parentElement && (parentElement.previousElementSibling as HTMLInputElement).value;
      if (inputValue) {
        activeNgComponent[prop] = inputValue;
        ng.applyChanges(activeNgComponent);
      }
    }
  };
}
