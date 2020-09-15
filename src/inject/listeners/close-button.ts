import { activePopovers, activePopoverIndex } from ".";
import { APP_EXT_CLOSE_BUTTON_ID } from "../../constants";

/**
 * As soon as tooltip is shown, we can start listening to `close buttons`, so that we can
 * close the tooltip
 *
 */
export function listenForCloseButton(): void {
  const closeButton = document.getElementById(APP_EXT_CLOSE_BUTTON_ID);
  if (closeButton) {
    closeButton.addEventListener("click", clickListener());
  }
}

export function stopListenForCloseButton(): void {
  const closeButton = document.getElementById(APP_EXT_CLOSE_BUTTON_ID);
  if (closeButton) {
    closeButton.removeEventListener("click", clickListener());
  }
}

function clickListener(): (this: HTMLElement, ev: MouseEvent) => any {
  return () => {
    if (activePopovers.length && activePopoverIndex > -1 && activePopovers[activePopoverIndex]) {
      activePopovers[activePopoverIndex].hide();
    }
  };
}
