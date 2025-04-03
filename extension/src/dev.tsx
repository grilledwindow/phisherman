import { render } from 'solid-js/web';
import { createSignal, createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';
import Popup, { PopupStore } from './popup/Popup';
import DialogHint, { DialogStore } from './dialog/DialogHint';

const root = document.querySelector('body');

const storeData = {
    pos: { top: 0, left: 0, width: 0, height: 0 },
    link: 'https://signin-ebay.com.sg',
    isPhish: false,
    show: true,
    onCancel: () => { setPhishPopupStore('show', false); }
}
const [phishPopupStore, setPhishPopupStore] = createStore<DialogStore>({ ...storeData, onCancel: () => { setPhishPopupStore('show', false) }, state: 'loading'  }); 

const toggleIsPhish = () => {
    console.log('clicked');
    setPhishPopupStore('state', v => v === 'safe' ? 'unsafe' : 'safe');
}
const toggleShow = () => {
    console.log('clicked');
    setPhishPopupStore('show', v => !v);
}

const ToggleIsPhish = () => {
    return <label class="mt-4 ml-4 block">isPhish<input type="checkbox" on:click={toggleIsPhish} /></label>
}
const ToggleShow = () => {
    return <label class="mt-4 ml-4 block">hide<input type="checkbox" on:click={toggleShow} /></label>
}

const [enabled, setEnabled] = createSignal(true);
const [popupStore, setPopupStore] = createStore<PopupStore>({
    enabled: () => enabled(),
    show: true,
    onCancel: () => setPopupStore('show', false),
    onToggleExtension: (checked) => setEnabled(checked) // triggers only if new value different
});

if (root) {
    render(() => <Popup store={popupStore} />, root);
    // render(() => <ToggleIsPhish />, root);
    // render(() => <ToggleShow />, root);
    // render(() => <DialogHint id='popup-border-phish' store={phishPopupStore} position='relative' />, root);
}

