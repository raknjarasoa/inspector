import { MESSAGES } from "./shared/constants";

const scriptElements: HTMLScriptElement[] = [];
const styleElements: HTMLLinkElement[] = [];
const customStyleElements: HTMLStyleElement[] = [];
let errorData: { error: string; type: string; message: string };

initContentScript();

function initContentScript(): void {
  injectScriptsAndStyles();
  const ngCheckScriptPath = chrome.runtime.getURL("inject/ng-check.js");
  injectScript(ngCheckScriptPath);
  startListeningForConnectionMessage();
  startListeningForErrorMessage();
  window.addEventListener("load", () => {
    chrome.storage.sync.clear();
  });
}

function injectScriptsAndStyles(): void {
  const scriptPath = [
    chrome.runtime.getURL("assets/lib/js/popper.min.js"),
    chrome.runtime.getURL("assets/lib/js/tippy-bundle.umd.min.js"),
    chrome.runtime.getURL("inject/in-app.js"),
  ];

  scriptPath.forEach((p) => injectScript(p));

  const stylePath = [
    chrome.runtime.getURL("assets/lib/css/tippy.css"),
    chrome.runtime.getURL("assets/lib/css/light-border.css"),
  ];

  stylePath.forEach((p) => injectStyle(p));

  injectCustomStyle();
}

function injectScript(path: string): void {
  const script = document.createElement("script");
  script.src = path;
  document.documentElement.appendChild(script);
  scriptElements.push(script);
}

function injectStyle(path: string): void {
  const style = document.createElement("link");
  style.setAttribute("rel", "stylesheet");
  style.setAttribute("href", path);
  document.head.appendChild(style);
  styleElements.push(style);
}

function injectCustomStyle(): void {
  const style = document.createElement("style");
  style.innerText = `.tippy-box {
          font-family: Arial, Helvetica, sans-serif;
          padding: 8px;
        }
        .tippy-box table td,
        .tippy-box table th {
          text-align: left;
        }
        .tippy-box select, .tippy-box .select-next-div {
          margin-top: 8px;
          margin-bottom: 8px;
        }
        .chrome-ext-ng-properties-prop-input-value {
          display: none;
        }`;
  document.head.appendChild(style);
  customStyleElements.push(style);
}

function startListeningForConnectionMessage(): void {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "check-connection") {
      sendResponse({ message: "connection-established" });
      if (errorData) {
        chrome.runtime.sendMessage(errorData, (response) => {});
      } else {
        startListeningForNgStatusMessage();
      }
    }
  });
}

function startListeningForNgStatusMessage(): void {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "check-ng-status") {
      sendResponse({ message: "checking-ng-status" });
      window.postMessage({ command: "start-ng-check" }, "*");
      window.addEventListener("message", (event) => {
        if (event.source != window) {
          return;
        }
        if (event.data.type === "ng-check-status") {
          const isAngular = event.data.isAngular;
          chrome.runtime.sendMessage(
            {
              command: "get-ng-status",
              status: event.data.isAngular,
            },
            () => {
              startListeningForAppMessage();
            }
          );
        }
      });
    }
  });
}

function startListeningForAppMessage(): void {
  chrome.runtime.onMessage.addListener((appMessage, appSender, appResponse) => {
    if (appMessage.command === "start") {
      appResponse({ message: "started" });
      window.postMessage({ command: "start" }, "*");
    } else if (appMessage.command === "end") {
      appResponse({ message: "ended" });
      window.postMessage({ command: "destroy" }, "*");
      window.addEventListener("message", (event) => {
        if (event.source != window) {
          return;
        }
        if (event.data.response === "destroyed") {
        }
      });
    }
  });
}

function startListeningForErrorMessage(): void {
  window.addEventListener("message", (event) => {
    if (event.source != window) {
      return;
    }
    if (event.data.type === "error") {
      errorData = {
        type: "error",
        error: event.data.error,
        message: MESSAGES[event.data.error],
      };
    }
  });
}
