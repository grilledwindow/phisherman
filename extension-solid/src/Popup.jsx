import { onMount } from 'solid-js';

function Popup() {
    onMount(() => {
        const id = document.getElementById('popup');
        console.log(id);
    });

    return (
        <div id="popup" class="absolute bg-black">hi</div>
    )
}

export default Popup;
