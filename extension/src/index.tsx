/* @refresh reload */
import { render } from 'solid-js/web';
import { createStore } from 'solid-js/store';
import { createSignal, createEffect } from 'solid-js';
import Tracer from './Tracer';
import './style.css';
import PopupHint, { PopupStore } from './PopupHint';

let body: HTMLElement | null;
let targets: HTMLElement[] = [];
const [enabled, setEnabled] = createSignal(true);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggle-extension') {
        setEnabled(v => {
            console.log('extension', !v ? 'enabled' : 'disabled');
            return !v;
        });
    }
});

const onTargetMouseenter = (event: MouseEvent) => {
    const target = event.target as HTMLAnchorElement;
    const { left, top } = target.getBoundingClientRect();
    setPopupStore('pos', {
        left: left + window.scrollX,
        top: top + window.scrollY,
        width: target.offsetWidth,
        height: target.offsetHeight
    });
    setPopupStore('link', target.href);
    setPopupStore('show', true);

    fetch('http://localhost:5000/query_url', {
        method: 'POST',
        body: JSON.stringify({ URL: target.href })
    })
        .then(res => res.json())
        .then(data => {
            setPopupStore('isPhish', data.is_phishing_link);
        });
}

const untrackTarget = (target: EventTarget) =>
    target.removeEventListener('mouseenter', onTargetMouseenter);
const trackTarget = (target: EventTarget) =>
    target.addEventListener('mouseenter', onTargetMouseenter);

const onBodyMouseover = (event: MouseEvent) => {
    let target = event.target as HTMLElement;
    if (target.id == tracerId || target.id == popupId) {
        return;
    }

    // covers e.g. <a><img></a>
    if (target.parentElement instanceof HTMLAnchorElement) {
        target = target.parentElement;
    }

    if (!(target instanceof HTMLAnchorElement) || !target.hasAttribute('href')) {
        setPopupStore('show', false);
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
    }
});

const tracerId = 'tracer';
const popupId = 'popup';
const [popupStore, setPopupStore] = createStore<PopupStore>({
    pos: { top: 0, left: 0, width: 0, height: 0 },
    link: '',
    isPhish: false,
    show: false,
    onCancel: () => { setPopupStore('show', false); }
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
    render(() => <Tracer id={tracerId} store={popupStore} />, html);
    render(() => <PopupHint id={popupId} store={popupStore} />, html);

    body.addEventListener('mouseover', onBodyMouseover);
}, 500);
