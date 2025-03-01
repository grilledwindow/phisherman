import { onMount, createEffect } from 'solid-js';
import { PopupStore } from './PopupHint';

export function PopupBorder(props: { id: string, store: PopupStore, position?: any }) {
    const store = props.store;
    const pos = store.pos;

    createEffect(() => {
        if (store.show) {
            const popup = document.getElementById(props.id);
            console.log(popup);
        }
    });

    return (
        <div id={props.id}
            style={{
                display: store.show ? 'block' : 'none',
                position: props.position || 'absolute',
                top: pos.top + pos.height * 0.66 +'px',
                left: pos.left + 20 + 'px',
                'max-width': window.innerWidth - pos.left - 50 + 'px',
            }}
            className="h-fit bg-[#e5e5e5] border-2 border-[#777] text-[#444] rounded-md overflow-hidden break-all drop-shadow-2xl shadow-lg"
        >
            <p className="p-2 block font-link"
                class={store.isPhish ? "bg-red" : "bg-green"}
            >{store.link}</p>
            <div className="flex w-full border-t-2 border-[#777] justify-end">
                <button
                    on:click={store.onCancel}
                    className="py-2 px-3 border-x-2 border-[#777] hover:cursor-pointer">Cancel</button>
                <button
                    on:click={() => window.open(store.link, '_blank')}
                    className="py-2 px-3 hover:cursor-pointer"
                    class={store.isPhish ? "bg-red" : "bg-green"}
                >
                    Open
                </button>
            </div>
        </div>
    )
}

export default PopupBorder;
