import { onMount } from 'solid-js';
import './style.css';

function Popup() {
    onMount(() => {
        const id = document.getElementById('popup');
        console.log(id);
    });

    return (
        <div id="popup" className="absolute bg-black">hi</div>
    )
}

export default Popup;
