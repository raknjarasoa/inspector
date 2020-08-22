chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.clear();
  chrome.contextMenus.create({
    id: "ngneat-inspect",
    title: "Inspect with ngneat inspector",
    contexts: ["all"]
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostPrefix: "localhost" },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "ngneat-inspect") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { command: "show" }, function (
          response
        ) {
          // will show popover
        });
      }
    });
  }
});
