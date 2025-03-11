/* @refresh reload */
import { render } from 'solid-js/web';
import { createStore } from 'solid-js/store';
import { createSignal, createEffect } from 'solid-js';
import Tracer from './dialog/Tracer';
import './style.css';
import DialogHint, { DialogStore } from './dialog/DialogHint';
import Popup, { PopupStore } from './popup/Popup';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggle-popup') {
        setPopupStore('show', v => !v);
    }
});

let body: HTMLElement | null;
let targets: HTMLElement[] = [];

const tracerId = 'tracer';
const dialogId = 'dialog';

const [enabled, setEnabled] = createSignal(true);
const [dialogStore, setDialogStore] = createStore<DialogStore>({
    pos: { top: 0, left: 0, width: 0, height: 0 },
    link: '',
    isPhish: false,
    show: false,
    onCancel: () => { setDialogStore('show', false); }
}); 

const [popupStore, setPopupStore] = createStore<PopupStore>({
    enabled: () => enabled(),
    show: false,
    onCancel: () => setPopupStore('show', false),
    onToggleExtension: (checked) => setEnabled(checked) // triggers only if new value different
});

const onTargetMouseenter = (event: MouseEvent) => {
    const target = event.target as HTMLAnchorElement;
    const { left, top } = target.getBoundingClientRect();
    setDialogStore('pos', {
        left: left + window.scrollX,
        top: top + window.scrollY,
        width: target.offsetWidth,
        height: target.offsetHeight
    });
    setDialogStore('link', target.href);
    setDialogStore('show', true);

    fetch('http://localhost:5000/query_url', {
        method: 'POST',
        body: JSON.stringify({ URL: target.href })
    })
        .then(res => res.json())
        .then(data => {
            setDialogStore('isPhish', data.is_phishing_link);
        });
}

const untrackTarget = (target: EventTarget) =>
    target.removeEventListener('mouseenter', onTargetMouseenter);
const trackTarget = (target: EventTarget) =>
    target.addEventListener('mouseenter', onTargetMouseenter);

const onBodyMouseover = (event: MouseEvent) => {
    let target = event.target as HTMLElement;
    if (target.id == tracerId || target.id == dialogId) {
        return;
    }

    // covers e.g. <a><img></a>
    if (target.parentElement instanceof HTMLAnchorElement) {
        target = target.parentElement;
    }

    if (!(target instanceof HTMLAnchorElement) || !target.hasAttribute('href')) {
        setDialogStore('show', false);
        return;
    }  else if (target.id && targets.hasOwnProperty(target.id)) {
        return;
    }

    targets.push(target);
    if (enabled()) {
        trackTarget(target);
    }
}

// attach/detach event listeners when extension is enabled/disabled
createEffect(() => {
    if (enabled()) {
        body?.addEventListener('mouseover', onBodyMouseover);
        targets.forEach(trackTarget);
    } else {
        body?.removeEventListener('mouseover', onBodyMouseover);
        targets.forEach(untrackTarget);
        setDialogStore('show', false);
    }
});

// main
const poll = setInterval(() => {
    body = document.querySelector('div.a3s.aiL');
    if (body === null) return;

    clearInterval(poll);

    // this is actually sooo important.
    // if appended to <body> instead of <html>, the popup disappears right after hovering over its child elements, i.e. <p>
    // this is because of the event listener attached to <body> determining that <p> isn't a Popup
    const html: HTMLHtmlElement | any = document.querySelector('html');
    render(() => <Tracer id={tracerId} store={dialogStore} />, html);
    render(() => <DialogHint id={dialogId} store={dialogStore} />, html);
    render(() => <Popup store={popupStore} />, html);

    body.addEventListener('mouseover', onBodyMouseover);
}, 500);
