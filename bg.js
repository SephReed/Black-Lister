// Show page action icon in omnibar.
function showPageAction( tabId, changeInfo, tab ) {
    chrome.pageAction.show(tabId);
};
// Call the above function when the url of a tab changes.
chrome.tabs.onUpdated.addListener(showPageAction);
