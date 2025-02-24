/* @refresh reload */
import { render } from 'solid-js/web';
import Popup from './Popup';
import './style.css';

let body;
const poll = setInterval(() => {
    body = document.querySelector('div.a3s.aiL');
    if (body !== null) {
        console.log(body);
        render(() => <Popup />, body);
        clearInterval(poll);
    }
}, 500);

