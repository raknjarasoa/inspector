import { isAngularAppRunning } from "./ng-check";
import { startDocumentOverListen, stopDocumentOverListen } from "./listeners";
const inAppMethods = { enabled: false };

initInAppScript();

function initInAppScript(): void {
  window.addEventListener("message", (event) => {
    if (event.source != window) {
      return;
    }
    if (event.data.command === "destroy") {
      disableInAppMethods();
    } else if (event.data.command === "start-ng-check") {
      if (isAngularAppRunning()) {
        window.postMessage({ type: "ng-check-status", isAngular: true }, "*");
      } else {
        window.postMessage({ type: "ng-check-status", isAngular: false }, "*");
      }
    } else if (event.data.command === "start") {
      if (isAngularAppRunning()) {
        const runtimeData: runtimeData = event.data.runtimeData;
        enableInAppMethods(runtimeData);
      } else {
        window.postMessage({ type: "ng-check-status", isAngular: false }, "*");
      }
    }
  });
}

function disableInAppMethods() {
  if (inAppMethods.enabled) {
    stopDocumentOverListen();
    inAppMethods.enabled = false;
    window.postMessage({ response: "destroyed" }, "*");
  }
}

function enableInAppMethods(runtimeData: runtimeData) {
  if (!inAppMethods.enabled) {
    startDocumentOverListen(runtimeData);
    inAppMethods.enabled = true;
    window.postMessage({ type: "ng-check-status", isAngular: true }, "*");
  }
}
