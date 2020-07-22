let isStarted = false;
let isAngular = false;
const enablerSwitch = document.getElementById(
  "enablerSwitch"
) as HTMLInputElement;
const statusP = document.getElementById("status") as HTMLParagraphElement;
const tabQueryData = { active: true, currentWindow: true };

function checkChromeStorage(port: chrome.runtime.Port): void {
  chrome.storage.sync.get(["status"], (result) => {
    isStarted = result.status === "started";
    enablerSwitch.checked = isStarted;
  });

  chrome.storage.sync.get(["isAngular"], (result) => {
    isAngular = result.isAngular;
    enablerSwitch.disabled = !isAngular;
    start(port);
  });
}

chrome.tabs.query(tabQueryData, (tabs) => {
  const port = chrome.tabs.connect(tabs[0].id);
  checkChromeStorage(port);
  port.onMessage.addListener((msg) => {
    if (msg.command === "check-is-angular") {
      checkChromeStorage(port);
    }
  });
});
function start(port: chrome.runtime.Port) {
  if (isAngular) {
    statusP.innerText =
      "You can enable/disable this extension from below switch.";
    enablerSwitch.addEventListener("change", (event) => {
      if ((event.target as HTMLInputElement).checked) {
        port.postMessage({ command: "start" });
        port.onMessage.addListener((msg) => {
          if (msg.response === "started") {
            chrome.storage.sync.set({ status: "started" });
            isStarted = true;
          }
        });
      } else {
        port.postMessage({ command: "end" });
        port.onMessage.addListener((msg) => {
          if (msg.response === "ended") {
            chrome.storage.sync.set({ status: "ended" });
            isStarted = false;
          }
        });
      }
    });
  } else {
    statusP.innerText =
      "You can enable this extension only in an Angular application.";
    enablerSwitch.disabled = true;
  }
}
