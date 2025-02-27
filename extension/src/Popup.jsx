import { onMount, createEffect } from 'solid-js';

function Popup(props) {
    const pos = props.pos;
    const isLink = props.isLink;
    const id = props.id;

    createEffect(() => {
        if (isLink()) {
            const popup = document.getElementById(id);
            console.log(popup);
        }
    });

    return (
        <div id={props.id}
            style={{
                display: isLink() ? 'block' : 'none',
                position: 'absolute',
                top: pos.top + pos.height * 0.66 +'px',
                left: pos.left + 20 + 'px',
                'max-width': window.innerWidth - pos.left - 50 + 'px',
            }}
            className="p-2 bg-[#F2F0E4] h-fit rounded-xl break-words shadow-xl"
        >
            <p>{props.popupText()}</p>
            <div className="mt-4 mb-2 flex w-full space-x-2 justify-end">
                <button className="py-1 px-3 rounded-full">Cancel</button>
                <button className="py-1 px-3 bg-[#DD8888] rounded-full">Open</button>
            </div>
        </div>
    )
}

export default Popup;
