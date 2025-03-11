chrome.action.onClicked.addListener(async ({ id }) => {
  chrome.tabs.sendMessage(id, { action: 'toggle-popup' });
});

async function getCurrentTab() {
  return chrome.tabs.query({active: true, lastFocusedWindow: true}).then(([tab]) => tab);
}
