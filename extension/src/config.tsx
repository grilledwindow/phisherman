import { render } from "solid-js/web";

// (async () => {
//   const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
//   const response = await chrome.tabs.sendMessage(tab.id, {message: "hello"});
//   // do something with response here, not outside the function
//   console.log(response);
// })();

const root = document.querySelector('body');

const Chrome = () => <div>ZE SQUONK {chrome.runtime}</div>

if (root) {

    render(() => <Chrome />, root);
}
