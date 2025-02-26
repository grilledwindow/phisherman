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
const tracerId = 'tracer';
const popupId = 'popup';

const poll = setInterval(() => {
    body = document.querySelector('div.a3s.aiL');
    if (body === null) {
        return;
    }

    clearInterval(poll);
    render(() => <Tracer id={tracerId} pos={pos} isLink={isLink} />, body);

    body.addEventListener('mouseover', (event) => {
        let target = event.target;

        if (target.id == tracerId || target.id == popupId) {
            return;
        }

        // covers e.g. <a><img></a>
        if (target.parentElement instanceof HTMLAnchorElement) {
            target = target.parentElement;
            setIsLink(true);
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
            setIsLink(true);
            const { left, top } = event.target.getBoundingClientRect();
            setPos('left', left + window.scrollX);
            setPos('top', top + window.scrollY);
            setPos('width', event.target.offsetWidth);
            setPos('height', event.target.offsetHeight);
        });
    });
}, 500);

