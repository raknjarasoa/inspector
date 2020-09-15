chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.clear();
  chrome.contextMenus.create({
    id: "ngneat-inspect",
    title: "Inspect with ngneat inspector",
    contexts: ["all"],
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
chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "ngneat-inspect") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { command: "show" }, () => {
          if (chrome.runtime.lastError) {
            // connection was not established, that means it is not an Angular 9+ application
            showNoNgPopup(tabs[0].id);
          }
        });
      }
    });
  }
});
chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.command === "show-no-ng-popup") {
    showNoNgPopup(sender.tab?.id);
  }
});
function showNoNgPopup(tabId: number | undefined) {
  if (tabId !== undefined) {
    chrome.pageAction.setIcon(
      {
        path: {
          "16": "assets/images/ngneat_bw_16.png",
          "32": "assets/images/ngneat_bw_32.png",
          "48": "assets/images/ngneat_bw_48.png",
          "128": "assets/images/ngneat_bw_128.png",
        },
        tabId,
      },
      () => {
        chrome.pageAction.setPopup(
          {
            popup: "./nong-popup.html",
            tabId,
          },
          () => {
            chrome.pageAction.show(tabId);
          }
        );
      }
    );
  }
}
