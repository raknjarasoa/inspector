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
        const stylesheetPath = event.data.runTimeData.stylesheetPath;
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", stylesheetPath, false);
        rawFile.onreadystatechange = function () {
          if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
              var allText = rawFile.responseText;
              enableInAppMethods({ stylesheet: allText });
            }
          }
        };
        rawFile.send(null);
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

function enableInAppMethods(runTimeData: { stylesheet: string }) {
  if (!inAppMethods.enabled) {
    startDocumentOverListen(runTimeData.stylesheet);
    inAppMethods.enabled = true;
    window.postMessage({ type: "ng-check-status", isAngular: true }, "*");
  }
}
