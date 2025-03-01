import { render } from 'solid-js/web';
import { createSignal, createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';
import PopupBorder from './PopupBorder';
import PopupOld from './PopupOld';
import PopupHint, { PopupStore } from './PopupHint';

const root = document.querySelector('body');

const [popupStore, setPopupStore] = createStore<PopupStore>({
    pos: { top: 0, left: 0, width: 0, height: 0 },
    link: 'https://www.ebay.com.sg/itm/296985383401?mkevt=1&mkpid=0&emsid=e11000.m168041.l183741&mkcid=7&ch=osgood&euid=4a87fa23c4054cb681e29f8dc8849661&bu=45395247861&exe=0&ext=0&osub=-1%7E1&crd=20250211065759&segname=11000',
    isPhish: false,
    show: true,
    onCancel: () => { setPopupStore('show', false); }
}); 

createEffect(() => console.log(popupStore.isPhish));

const toggleIsPhish = () => {
    console.log('clicked');
    setPopupStore('isPhish', v => !v);
}

const ToggleIsPhish = () => {
    return <label class="mt-4 ml-4 block">isPhish<input type="checkbox" on:click={toggleIsPhish} /></label>
}

if (root) {
    render(() => <ToggleIsPhish />, root);
    render(() => <PopupBorder id='popup' store={popupStore} position='relative' />, root);
    render(() => <PopupOld id='old-popup' store={popupStore} position='relative' />, root);
    render(() => <PopupHint id='old-popup2' store={popupStore} position='relative' />, root);
}

