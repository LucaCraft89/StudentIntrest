// Listen for extension icon click
chrome.action.onClicked.addListener(() => {
  // Open the extension page in a new tab
  chrome.tabs.create({
    url: chrome.runtime.getURL("page.html"),
  });
});
