let isStarted = false;
let isAngular = false;
const startButton = document.getElementById("start") as HTMLInputElement;
const stopButton = document.getElementById("stop") as HTMLInputElement;
const statusP = document.getElementById("status") as HTMLParagraphElement;
const tabQueryData = { active: true, currentWindow: true };

function checkChromeStorage(port: chrome.runtime.Port): void {
  chrome.storage.sync.get(["status"], (result) => {
    isStarted = result.status === "started";
    startButton.innerText = isStarted ? "Started" : "Start";
    startButton.disabled = isStarted ? true : false;
    stopButton.innerText = isStarted ? "Stop" : "Stopped";
    stopButton.disabled = isStarted ? false : true;
  });

  chrome.storage.sync.get(["isAngular"], (result) => {
    isAngular = result.isAngular;
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
    statusP.innerText = "";
    startButton.addEventListener("click", () => {
      port.postMessage({ command: "start" });
      port.onMessage.addListener((msg) => {
        if (msg.response === "started") {
          chrome.storage.sync.set({ status: "started" });
          isStarted = true;
          startButton.innerText = "Started";
          startButton.disabled = true;
          stopButton.innerText = "Stop";
          stopButton.disabled = false;
        }
      });
    });
    stopButton.addEventListener("click", () => {
      port.postMessage({ command: "end" });
      port.onMessage.addListener((msg) => {
        if (msg.response === "ended") {
          chrome.storage.sync.set({ status: "ended" });
          isStarted = false;
          startButton.innerText = "Start";
          startButton.disabled = false;
          stopButton.innerText = "Stopped";
          stopButton.disabled = true;
        }
      });
    });
  } else {
    statusP.innerText = "This is not an Angular application.";
    startButton.disabled = true;
    stopButton.disabled = true;
  }
}
