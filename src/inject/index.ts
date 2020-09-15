import { isAngularAppRunning } from "./ng-check";
import {
  activePopoverIndex,
  activePopovers,
  oldActivePopoverIndex,
  startContextMenuListen,
  stopDocumentContextMenuListen,
} from "./listeners";

initInAppScript();

function initInAppScript(): void {
  window.postMessage({ type: "send-runtime-data" }, "*");
  window.addEventListener("message", (event) => {
    if (event.source != window) {
      return;
    }
    if (event.data.command === "receive-runtime-data") {
      const runTimeData: RunTimeData = event.data.runTimeData;
      if (isAngularAppRunning()) {
        startContextMenuListen(runTimeData);
        window.postMessage({ type: "ng-check-status", isAngular: true }, "*");
        window.addEventListener("message", (event) => {
          if (event.source != window) {
            return;
          }
          if (event.data.command === "show") {
            if (activePopovers.length && oldActivePopoverIndex > -1 && activePopovers[oldActivePopoverIndex]) {
              activePopovers[oldActivePopoverIndex].hide();
            }
            if (activePopovers.length && activePopoverIndex > -1 && activePopovers[activePopoverIndex]) {
              activePopovers[activePopoverIndex].show();
            }
          }
        });
      } else {
        window.postMessage({ type: "ng-check-status", isAngular: false }, "*");
        stopDocumentContextMenuListen(runTimeData);
      }
    }
  });
}
