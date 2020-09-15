import { activeNgComponent } from ".";
import {
  APP_EXT_PROP_OBJECT_BUTTON_ID,
  APP_EXT_BUTTON_PROP,
  APP_EXT_PROP_OBJECT_VALUE,
  APP_EXT_PROP_OBJECT_VALUE_ERROR,
} from "../../constants";

declare const ng: any;

/**
 * As soon as tooltip is shown, we can start listening to `update buttons`, so that we can
 * capture events and update the component.
 *
 */
export function listenForObjectUpdate(): void {
  const valueButton = document.getElementById(APP_EXT_PROP_OBJECT_BUTTON_ID);
  if (valueButton) {
    valueButton.addEventListener("click", clickListener());
  }
}

export function stopListenForObjectUpdate(): void {
  const valueButton = document.getElementById(APP_EXT_PROP_OBJECT_BUTTON_ID);
  if (valueButton) {
    valueButton.removeEventListener("click", clickListener());
  }
}

function clickListener(): (this: HTMLElement, ev: MouseEvent) => any {
  return (event) => {
    const prop = (event.target as Element).getAttribute(APP_EXT_BUTTON_PROP);
    if (activeNgComponent && prop) {
      const element = document.getElementById(APP_EXT_PROP_OBJECT_VALUE);
      const inputValue = element && element.innerText;
      if (inputValue) {
        // we need to replace all white space characters between html tags
        // generated due to prism.js/
        // thanks to https://stackoverflow.com/a/48632166
        const jsonString = inputValue.replace(/("[^"]*")|([ \s]+)/g, (x) => {
          return x.charCodeAt(0) == 34 ? x : "";
        });
        if (jsonString) {
          const errorElement = document.getElementById(APP_EXT_PROP_OBJECT_VALUE_ERROR);
          try {
            activeNgComponent[prop] = JSON.parse(jsonString);
            ng.applyChanges(activeNgComponent);
            if (errorElement) {
              errorElement.innerText = "";
            }
          } catch (e) {
            if (errorElement) {
              errorElement.innerText = "⚠️ Error while parsing JSON!";
            }
          }
        }
      }
    }
  };
}
