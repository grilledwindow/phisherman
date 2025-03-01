import { onMount, createEffect } from 'solid-js';
import { PopupStore } from './PopupHint';

export function PopupOld(props: { id: string, store: PopupStore, position?: string | undefined }) {
    const store = props.store;
    const pos = store.pos;
    const show = store.show;
    const isPhish = store.isPhish;

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
            className="h-fit p-3 bg-[#e5e5e5] text-[#444] rounded-xl overflow-hidden break-all drop-shadow-2xl shadow-lg"
        >
            <p className="block font-link mb-3 p-2 rounded-xl"
                class={store.isPhish ? "bg-red" : "bg-green"}
            >{store.link}</p>
            <div className="flex w-full space-x-2 justify-end">
                <button
                    on:click={store.onCancel}
                    className="py-2 px-3 hover:cursor-pointer">Cancel</button>
                <button
                    on:click={() => window.open(store.link, '_blank')}
                    className="py-2 px-3 rounded-full hover:cursor-pointer"
                    class={store.isPhish ? "bg-red" : "bg-green"}
                >
                    Open
                </button>
            </div>
        </div>
    )
}

export default PopupOld;

