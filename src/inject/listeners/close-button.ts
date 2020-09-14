import { Instance } from "tippy.js";
import { APP_EXT_CLOSE_BUTTON_ID } from "../../constants";

/**
 * As soon as tooltip is shown, we can start listening to `close buttons`, so that we can
 * close the tooltip
 *
 */
export function listenForCloseButton(
  activePopovers: Instance[],
  activePopoverIndex: number
): void {
  const closeButton = document.getElementById(APP_EXT_CLOSE_BUTTON_ID);
  if (closeButton) {
    closeButton.addEventListener(
      "click",
      clickListener(activePopovers, activePopoverIndex)
    );
  } else {
  }
}

export function stopListenForCloseButton(
  activePopovers: Instance[],
  activePopoverIndex: number
): void {
  const closeButton = document.getElementById(APP_EXT_CLOSE_BUTTON_ID);
  if (closeButton) {
    closeButton.removeEventListener(
      "click",
      clickListener(activePopovers, activePopoverIndex)
    );
  } else {
  }
}

function clickListener(
  activePopovers: Instance[],
  activePopoverIndex: number
): (this: HTMLElement, ev: MouseEvent) => any {
  return (event) => {
    if (
      activePopovers.length &&
      activePopoverIndex > -1 &&
      activePopovers[activePopoverIndex]
    ) {
      activePopovers[activePopoverIndex].hide();
    }
  };
}
