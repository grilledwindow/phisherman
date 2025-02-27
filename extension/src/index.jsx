/* @refresh reload */
import { render } from 'solid-js/web';
import { createStore } from 'solid-js/store';
import { createSignal, createEffect } from 'solid-js';
import Popup from './Popup';
import Tracer from './Tracer';
import './style.css';

let body;
let targets = {};

const [pos, setPos] = createStore({ top: 0, left: 0, width: 0, height: 0 });
const [isLink, setIsLink] = createSignal(false);
const [popupText, setPopupText] = createSignal('');
const tracerId = 'tracer';
const popupId = 'popup';

const poll = setInterval(() => {
    body = document.querySelector('div.a3s.aiL');
    if (body === null) return;

    clearInterval(poll);

    // this is actually sooo important.
    // if appended to <body> instead of <html>, the popup disappears right after hovering over its child elements, i.e. <p>
    const html = document.querySelector('html');
    render(() => <Tracer id={tracerId} pos={pos} isLink={isLink} />, html);
    render(() => <Popup id={popupId} pos={pos} isLink={isLink} popupText={popupText} />, html);

    body.addEventListener('mouseover', (event) => {
        let target = event.target;
        if (target.id == tracerId || target.id == popupId) {
            return;
        }

        // covers e.g. <a><img></a>
        if (target.parentElement instanceof HTMLAnchorElement) {
            target = target.parentElement;
        }

        if (!(target instanceof HTMLAnchorElement) || !target.hasAttribute('href')) {
            setIsLink(false);
            return;
        }  else if (target.id && targets.hasOwnProperty(target.id)) {
            return;
        }

        target.id = Math.ceil(Math.random() * 100000);
        targets[target.id] = target.href;
        target.addEventListener('mouseenter', (event) => {
            const { left, top } = event.target.getBoundingClientRect();
            setPos('left', left + window.scrollX);
            setPos('top', top + window.scrollY);
            setPos('width', event.target.offsetWidth);
            setPos('height', event.target.offsetHeight);
            setPopupText(event.target.href);
            setIsLink(true);

            fetch('http://localhost:5000/query_url', {
                method: 'POST',
                body: JSON.stringify({ URL: target.href })
            })
                .then(data => data.json())
                .then(console.log);
        });
    });
}, 500);
