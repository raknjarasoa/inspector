let isStarted = false;
let isAngular = false;
const enablerSwitch = document.getElementById(
  "enablerSwitch"
) as HTMLInputElement;
const statusP = document.getElementById("status") as HTMLParagraphElement;
const tabQueryData = { active: true, currentWindow: true };

initPopup();

function initPopup(): void {
  chrome.storage.sync.get(["isAngular"], (result) => {
    if (result.isAngular) {
      getActiveTabID((tabId: number, tabs: chrome.tabs.Tab[]) => {
        isAngular = true;
        readNgStatus(tabs);
      });
    } else {
      initiateFlow();
    }
  });
}

function getActiveTabID(cb: Function): void {
  chrome.tabs.query(tabQueryData, (tabs) => {
    cb(tabs[0].id, tabs);
  });
}

function initiateFlow(): void {
  getActiveTabID((tabId: number, tabs: chrome.tabs.Tab[]) => {
    chrome.tabs.sendMessage(
      tabId,
      { command: "check-connection" },
      (connectionResponse) => {
        if (
          connectionResponse &&
          connectionResponse.message === "connection-established"
        ) {
          chrome.tabs.sendMessage(
            tabId,
            { command: "check-ng-status" },
            (ngStatusResponse) => {
              if (
                ngStatusResponse &&
                ngStatusResponse.message === "checking-ng-status"
              ) {
                chrome.runtime.onMessage.addListener(
                  (message, sender, sendResponse) => {
                    sendResponse();
                    if (message && message.command === "get-ng-status") {
                      isAngular = message.status;
                      readNgStatus(tabs);
                    } else {
                      reset();
                    }
                  }
                );
              } else {
                reset();
              }
            }
          );
        } else {
          reset();
        }
      }
    );
  });
}

function readNgStatus(tabs: chrome.tabs.Tab[]) {
  try {
    enablerSwitch.disabled = !isAngular;
    statusP.innerText = isAngular
      ? "You can enable/disable this extension from below switch."
      : "You can enable this extension only in an Angular application.";
    chrome.storage.sync.get(["status"], (result) => {
      isStarted = result.status === "started";
      if (isStarted) {
        enablerSwitch.checked = true;
        chrome.tabs.sendMessage(
          tabs[0].id,
          { command: "start" },
          (startResponse) => {
            if (startResponse.message && startResponse.message === "started") {
              chrome.storage.sync.set({ status: "started" });
              isStarted = true;
            } else {
              reset();
            }
          }
        );
      }
      listenToSwitch(tabs);
    });
  } catch (e) {
    reset();
  }
}

function reset() {
  chrome.storage.sync.set({ status: "ended" });
  chrome.storage.sync.set({ isAngular: false });
  enablerSwitch.checked = false;
  enablerSwitch.disabled = true;
  statusP.innerText =
    "You can enable this extension only in an Angular application.";
  isAngular = false;
  isStarted = false;
  initPopup();
}

function listenToSwitch(tabs: chrome.tabs.Tab[]) {
  enablerSwitch.addEventListener("change", (event) => {
    if ((event.target as HTMLInputElement).checked) {
      if (!isStarted) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { command: "start" },
          (startResponse) => {
            if (startResponse.message && startResponse.message === "started") {
              chrome.storage.sync.set({ status: "started" });
              isStarted = true;
            } else {
              chrome.storage.sync.set({ status: "ended" });
              chrome.storage.sync.set({ isAngular: false });
              enablerSwitch.checked = false;
              enablerSwitch.disabled = false;
              isAngular = false;
              isStarted = false;
            }
          }
        );
      }
    } else {
      if (isStarted) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { command: "end" },
          (endResponse) => {
            if (endResponse && endResponse.message === "ended") {
              chrome.storage.sync.set({ status: "ended" });
              isStarted = false;
            } else {
              reset();
            }
          }
        );
      }
    }
  });
}
