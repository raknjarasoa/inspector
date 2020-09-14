const scriptElements: HTMLScriptElement[] = [];
const styleElements: HTMLLinkElement[] = [];

initContentScript();

function initContentScript(): void {
  injectScriptsAndStyles();
  startListeningMessagesFromInject();
  window.addEventListener("load", () => {
    chrome.storage.sync.clear();
  });
}

function injectScriptsAndStyles(): void {
  const scriptPath = [chrome.runtime.getURL("inject/index.js")];

  scriptPath.forEach((p) => injectScript(p));

  const stylePath = [
    chrome.runtime.getURL("styles/index.css"),
    chrome.runtime.getURL("assets/css/tippy.css"),
    chrome.runtime.getURL("assets/css/light-border.css"),
    chrome.runtime.getURL("assets/css/prism.css"),
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

function startListeningMessagesFromInject(): void {
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
    if (event.data.type === "send-runtime-data") {
      const runTimeData: RunTimeData = {
        paths: {
          tooltip: chrome.runtime.getURL("assets/templates/tooltip.ejs"),
        },
      };

      window.postMessage(
        {
          command: "receive-runtime-data",
          runTimeData,
        },
        "*"
      );
    }
  });
}
