/* @refresh reload */
import { render } from 'solid-js/web';
import App from './App';

let body;
const poll = setInterval(() => {
    body = document.querySelector('div.a3s.aiL');
    if (body !== null) {
        console.log(body);
        render(() => <App />, body);
        clearInterval(poll);
    }
}, 500);

