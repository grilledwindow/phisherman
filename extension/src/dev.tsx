import { render } from 'solid-js/web';
import { createStore } from 'solid-js/store';
import { PopupStore } from './Popup';
import Popup from './Popup';

const root = document.querySelector('html');

const [popupStore, setPopupStore] = createStore<PopupStore>({
    pos: { top: 20, left: 0, width: 0, height: 0 },
    link: 'https://www.ebay.com.sg/itm/296985383401?mkevt=1&mkpid=0&emsid=e11000.m168041.l183741&mkcid=7&ch=osgood&euid=4a87fa23c4054cb681e29f8dc8849661&bu=45395247861&exe=0&ext=0&osub=-1%7E1&crd=20250211065759&segname=11000',
    isPhish: false,
    show: true,
    onCancel: () => { setPopupStore('show', false); }
}); 

root && render(() => <Popup id='popup' store={popupStore} />, root);

