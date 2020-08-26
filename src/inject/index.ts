import { isAngularAppRunning } from "./ng-check";
import {
  activePopoverIndex,
  activePopovers,
  oldActivePopoverIndex,
  startDocumentOverListen,
  stopDocumentOverListen,
} from "./listeners";

initInAppScript();

function initInAppScript(): void {
  if (isAngularAppRunning()) {
    startDocumentOverListen();
    window.postMessage({ type: "ng-check-status", isAngular: true }, "*");
    window.addEventListener("message", (event) => {
      if (event.source != window) {
        return;
      }
      if (event.data.command === "show") {
        if (
          activePopovers.length &&
          oldActivePopoverIndex > -1 &&
          activePopovers[oldActivePopoverIndex]
        ) {
          activePopovers[oldActivePopoverIndex].hide();
        }
        if (
          activePopovers.length &&
          activePopoverIndex > -1 &&
          activePopovers[activePopoverIndex]
        ) {
          activePopovers[activePopoverIndex].show();
        }
      }
    });
  } else {
    window.postMessage({ type: "ng-check-status", isAngular: false }, "*");
    stopDocumentOverListen();
  }
}
