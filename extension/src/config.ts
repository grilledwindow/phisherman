const btn = document.getElementById('btn');

btn?.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  const response = chrome.tabs.sendMessage(tab.id, { action: 'toggle-extension'});
  // do something with response here, not outside the function
  console.log(response);
});
