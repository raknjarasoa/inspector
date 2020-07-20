const scriptElements: HTMLScriptElement[] = [];
const styleElements: HTMLLinkElement[] = [];
const customStyleElements: HTMLStyleElement[] = [];
let connectionPort: chrome.runtime.Port = null;

function init(): void {
  const scriptPath = [
    "https://unpkg.com/@popperjs/core@2",
    "https://unpkg.com/tippy.js@6",
    chrome.runtime.getURL("in-app.js"),
  ];

  scriptPath.forEach((p) => injectScript(p));

  const stylePath = [
    "https://unpkg.com/tippy.js@6/dist/tippy.css",
    "https://unpkg.com/tippy.js@6/themes/light-border.css",
  ];

  stylePath.forEach((p) => injectStyle(p));

  injectCustomStyle();
}
function injectScript(path: string): void {
  const script = document.createElement("script");
  script.src = path;
  document.documentElement.appendChild(script);
  // script.parentElement.removeChild(script);
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
        }
        .tippy-box table td,
        .tippy-box table th {
          text-align: left;
        }
        .chrome-ext-ng-properties-prop-input-value {
          display: none;
        }`;
  document.head.appendChild(style);
  customStyleElements.push(style);
}

function destroy(): void {
  // scriptElements.forEach((script) => {
  //   document.documentElement.removeChild(script);
  // });
  styleElements.forEach((style) => {
    document.head.removeChild(style);
  });
  customStyleElements.forEach((style) => {
    document.head.removeChild(style);
  });
}

window.addEventListener("message", (event) => {
  chrome.storage.sync.set({ isAngular: event.data.isAngular });
  if (event.data && (event.data.isAngular || event.data.isAngular === false)) {
    connectionPort.postMessage({ command: "check-is-angular" });
  }
});

chrome.runtime.onConnect.addListener((port) => {
  connectionPort = port;
  const ngCheckScriptPath = chrome.runtime.getURL("ng-check.js");
  injectScript(ngCheckScriptPath);
  port.onMessage.addListener(function (msg) {
    if (msg.command === "start") {
      init();
      port.postMessage({ response: "started" });
    } else if (msg.command === "end") {
      window.postMessage({ command: "destroy" }, "*");
      window.addEventListener("message", (event) => {
        if (event.data.response === "destroyed") {
          port.postMessage({ response: "ended" });
          destroy();
        }
      });
    }
  });
});
