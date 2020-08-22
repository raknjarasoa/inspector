import { MESSAGES } from "./shared/constants";

const scriptElements: HTMLScriptElement[] = [];
const styleElements: HTMLLinkElement[] = [];
let errorData: { error: string; type: string; message: string };

initContentScript();

function initContentScript(): void {
  injectScriptsAndStyles();
  startListeningForNgStatusMessage();
  startListeningForErrorMessage();
  window.addEventListener("load", () => {
    chrome.storage.sync.clear();
  });
}

function injectScriptsAndStyles(): void {
  const scriptPath = [chrome.runtime.getURL("inject/index.js")];

  scriptPath.forEach((p) => injectScript(p));

  const stylePath = [
    chrome.runtime.getURL("inject/index.css"),
    chrome.runtime.getURL("assets/css/tippy.css"),
    chrome.runtime.getURL("assets/css/light-border.css"),
  ];

  stylePath.forEach((p) => injectStyle(p));
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

// function startListeningForConnectionMessage(): void {
//   chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.command === "check-connection") {
//       sendResponse({ message: "connection-established" });
//       if (errorData) {
//         chrome.runtime.sendMessage(errorData, (response) => {});
//       } else {
//         startListeningForNgStatusMessage();
//       }
//     }
//   });
// }

function startListeningForNgStatusMessage(): void {
  window.addEventListener("message", (event) => {
    if (event.source != window) {
      return;
    }
    if (event.data.type === "ng-check-status") {
      const isAngular = event.data.isAngular;
      if (isAngular) {
        chrome.runtime.onMessage.addListener(function (
          request,
          sender,
          sendResponse
        ) {
          if (request.command == "show") {
            sendResponse({ status: "will-show" });
            window.postMessage(
              {
                command: "show",
              },
              "*"
            );
          }
        });
      } else {
        chrome.contextMenus.remove("show-props");
      }
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
