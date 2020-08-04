import { APP_EXT_CONST_STORAGE_KEY_PREFIX } from "../../shared/constants";

let isStarted = false;
let isAngular = false;
const enablerSwitch = document.getElementById(
  "enablerSwitch"
) as HTMLInputElement;
const statusP = document.getElementById("status") as HTMLElement;
const errorAlert = document.getElementById("errorAlert") as HTMLElement;
errorAlert.style.display = "none";
const switchParent = document.getElementById("switchParent") as HTMLElement;
switchParent.style.display = "none";
const tabQueryData = { active: true, currentWindow: true };
let currentTabID: number;
let storageKey: string;

initPopup();

function initPopup(): void {
  chrome.tabs.query(tabQueryData, (tabs) => {
    let activeTabID = tabs[0].id;
    if (typeof activeTabID === "number") {
      currentTabID = activeTabID;
      storageKey = APP_EXT_CONST_STORAGE_KEY_PREFIX + currentTabID;
      getIsAngularFromStorage();
      initErrorMessages();
    } else {
      throw new Error("Unable to fetch active tab ID");
    }
  });
}

function getIsAngularFromStorage() {
  readSyncStorage("isAngular", (value) => {
    if (value) {
      isAngular = true;
      readNgStatus();
    } else {
      initiateFlow();
    }
  });
}

function initiateFlow(): void {
  chrome.tabs.sendMessage(
    currentTabID,
    { command: "check-connection" },
    (connectionResponse) => {
      if (
        connectionResponse &&
        connectionResponse.message === "connection-established"
      ) {
        chrome.tabs.sendMessage(
          currentTabID,
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
                    updateSyncStorage({ isAngular });
                    readNgStatus();
                  }
                }
              );
            }
          }
        );
      }
    }
  );
}

function readNgStatus() {
  switchParent.style.display = isAngular ? "block" : "none";
  enablerSwitch.disabled = !isAngular;
  statusP.style.display = isAngular ? "none" : "block";
  readSyncStorage("status", (value) => {
    if (value === "started") {
      try {
        chrome.tabs.sendMessage(
          currentTabID,
          { command: "start" },
          (startResponse) => {
            if (startResponse && startResponse.message === "started") {
              isStarted = true;
              enablerSwitch.checked = true;
              updateSyncStorage({ status: "started" });
            } else {
              resetPopup();
            }
          }
        );
      } catch (_) {}
    }
    listenToSwitch();
  });
}

function listenToSwitch() {
  enablerSwitch.addEventListener("change", (event) => {
    if ((event.target as HTMLInputElement).checked) {
      if (!isStarted) {
        chrome.tabs.sendMessage(
          currentTabID,
          { command: "start" },
          (startResponse) => {
            if (startResponse && startResponse.message === "started") {
              updateSyncStorage({ status: "started" });
              isStarted = true;
            } else {
              resetPopup();
            }
          }
        );
      }
    } else {
      if (isStarted) {
        chrome.tabs.sendMessage(
          currentTabID,
          { command: "end" },
          (endResponse) => {
            if (endResponse && endResponse.message === "ended") {
              updateSyncStorage({ status: "ended" });
              isStarted = false;
            }
          }
        );
      }
    }
  });
}

function resetPopup() {
  updateSyncStorage({ status: "ended", isAngular: false });
  enablerSwitch.checked = false;
  enablerSwitch.disabled = false;
  switchParent.style.display = "none";
  statusP.style.display = "block";
  isAngular = false;
  isStarted = false;
}

function initErrorMessages(): void {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "error") {
      errorAlert.style.display = "block";
      switchParent.style.display = "none";
      statusP.style.display = "none";
      errorAlert.innerHTML = "&#9888;" + message.message;
      sendResponse();
    }
  });
}

function updateSyncStorage(pair: { [key: string]: string | boolean }): void {
  chrome.storage.sync.get([storageKey], (data) => {
    let result = {};
    if (data[storageKey]) {
      result = Object.assign(result, data[storageKey]);
    }
    result = Object.assign(result, pair);
    chrome.storage.sync.set({ [storageKey]: result });
  });
}

function readSyncStorage(
  key: string,
  cb: (value: string | boolean | undefined) => void
): void {
  chrome.storage.sync.get([storageKey], (data) => {
    if (data[storageKey] && data[storageKey][key]) {
      cb(data[storageKey][key]);
    } else {
      cb(undefined);
    }
  });
}
