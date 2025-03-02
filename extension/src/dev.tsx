import { render } from 'solid-js/web';
import { createSignal, createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';
import PopupBorder from './PopupBorder';
import PopupHint, { PopupStore } from './PopupHint';

const root = document.querySelector('body');

const storeData = {
    pos: { top: 0, left: 0, width: 0, height: 0 },
    link: 'https://www.ebay.com.sg/itm/296985383401?mkevt=1&mkpid=0&emsid=e11000.m168041.l183741&mkcid=7&ch=osgood&euid=4a87fa23c4054cb681e29f8dc8849661&bu=45395247861&exe=0&ext=0&osub=-1%7E1&crd=20250211065759&segname=11000',
    isPhish: false,
    show: true,
    onCancel: () => { setSafePopupStore('show', false); }
}
const [safePopupStore, setSafePopupStore] = createStore<PopupStore>({ ...storeData }); 
const [phishPopupStore, setPhishPopupStore] = createStore<PopupStore>({ ...storeData, onCancel: () => { setPhishPopupStore('show', false) }, isPhish: true  }); 

const toggleIsPhish = () => {
    console.log('clicked');
    setSafePopupStore('isPhish', v => !v);
    setPhishPopupStore('isPhish', v => !v);
}

const ToggleIsPhish = () => {
    return <label class="mt-4 ml-4 block">isPhish<input type="checkbox" on:click={toggleIsPhish} /></label>
}

if (root) {
    render(() => <ToggleIsPhish />, root);
    render(() => <PopupBorder id='popup-border-phish' store={phishPopupStore} position='relative' />, root);
    render(() => <PopupHint id='popup-hint-phish' store={phishPopupStore} position='relative' />, root);
    render(() => <PopupBorder id='popup-border-safe' store={safePopupStore} position='relative' />, root);
    render(() => <PopupHint id='popup-hint-safe' store={safePopupStore} position='relative' />, root);
}

