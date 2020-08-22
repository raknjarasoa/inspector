import { isAngularAppRunning } from "./ng-check";
import {
  activePopoverIndex,
  activePopovers,
  startDocumentOverListen,
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
          activePopoverIndex > -1 &&
          activePopovers[activePopoverIndex]
        ) {
          activePopovers[activePopoverIndex].show();
        }
      }
    });
  } else {
    window.postMessage({ type: "ng-check-status", isAngular: false }, "*");
  }
}

// function disableInAppMethods() {
//   if (inAppMethods.enabled) {
//     stopDocumentOverListen();
//     inAppMethods.enabled = false;
//     window.postMessage({ response: "destroyed" }, "*");
//   }
// }

// function enableInAppMethods(runtimeData: runtimeData) {
//   if (!inAppMethods.enabled) {
//     startDocumentOverListen(runtimeData);
//     inAppMethods.enabled = true;
//     window.postMessage({ type: "ng-check-status", isAngular: true }, "*");
//   }
// }
