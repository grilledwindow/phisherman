/* @refresh reload */
import { render } from 'solid-js/web';
import { createStore } from 'solid-js/store';
import { createSignal, createEffect } from 'solid-js';
import Tracer from './dialog/Tracer';
import './style.css';
import DialogHint, { DialogStore } from './dialog/DialogHint';
import Popup, { PopupStore } from './popup/Popup';
import ContextDialog from './dialog/ContextDialog';

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
    show: false,
    state: 'loading',
    onCancel: () => { setDialogStore('show', false); }
}); 

const [contextDialogStore, setContextDialogStore] = createStore<DialogStore>({
    pos: { top: 0, left: 0, width: 0, height: 0 },
    link: '',
    show: false,
    state: 'loading',
    onCancel: () => { setContextDialogStore('show', false); }
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
    setDialogStore('state', 'loading');
    setDialogStore('pos', {
        left: left + window.scrollX,
        top: top + window.scrollY,
        width: target.offsetWidth,
        height: target.offsetHeight
    });
    setDialogStore('link', target.href);
    setDialogStore('show', true);

    setTimeout(() => {
        setDialogStore('state', target.className.includes('unsafe') ? 'unsafe' : 'safe');
    }, 500);
    // fetch('http://127.0.0.1:5000/query_url', {
    //     method: 'POST',
    //     headers: {
    //         "Content-type": "application/json; charset=UTF-8",
    //         'Access-Control-Allow-Origin': '*'
    //     },
    //     body: JSON.stringify({ URL: target.href })
    // })
    //     // .then(console.log)
    //     .then(res => res.json())
    //     .then(data => {
    //         const id = '' + Math.random() * 10000;
    //         console.time(id);
    //         console.log('data', data);
    //         console.timeEnd(id);
    //         setDialogStore('state', data.is_phishing_link ? 'unsafe' : 'safe');
    //     });
}

const untrackTarget = (target: EventTarget) =>
    target.removeEventListener('mouseenter', onTargetMouseenter);
const trackTarget = (target: EventTarget) =>
    target.addEventListener('mouseenter', onTargetMouseenter);

const contextIdContentMap: { [key: string]: string } = {
    'highlight-1': 'Sounds unusually pressurising',
    'highlight-2': 'Legitimate companies rarely ask for your payment information. Ensure it is through a safe channel'
};
const onBodyMouseover = (event: Event) => {
    let target = event.target as HTMLElement;
    if (target.id == tracerId || target.id == dialogId) {
        return;
    }

    if (!Object.keys(contextIdContentMap).includes(target.id)) {
        setContextDialogStore('show', false);
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

const onContextMouseover = (event: Event) => {
    const target = event.target as HTMLAnchorElement;
    const { left, top } = target.getBoundingClientRect();
    setContextDialogStore('pos', {
        left: left + window.scrollX,
        top: top + window.scrollY,
        width: target.offsetWidth,
        height: target.offsetHeight
    });
    setContextDialogStore('link', contextIdContentMap[target.id]);
    setContextDialogStore('show', true);
}

// attach/detach event listeners when extension is enabled/disabled
createEffect(() => {
    const contexts = document.getElementsByClassName('highlight');
    if (enabled()) {
        body?.addEventListener('mouseover', onBodyMouseover);
        targets.forEach(trackTarget);
        [...contexts].forEach((e) => {
            e.setAttribute('class', 'highlight bg-red bg-opacity-50')
            e.addEventListener('mouseenter', onContextMouseover);
        });
    } else {
        body?.removeEventListener('mouseover', onBodyMouseover);
        targets.forEach(untrackTarget);
        setDialogStore('show', false);
        [...contexts].forEach((e) => {
            e.setAttribute('class', 'highlight bg-none');
            e.removeEventListener('mouseenter', onContextMouseover);
        });
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
    render(() => <ContextDialog store={contextDialogStore} />, html);

    body.addEventListener('mouseover', onBodyMouseover);
}, 500);
