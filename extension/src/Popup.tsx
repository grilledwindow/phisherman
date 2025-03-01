import { onMount, createEffect } from 'solid-js';

type Pos = { left: number, top: number, width: number, height: number };
export type PopupStore = {
    pos: Pos,
    link: string,
    show: boolean,
    isPhish: boolean,
    onCancel: () => void
};

export function Popup(props: { id: string, store: PopupStore }) {
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
                position: 'absolute',
                top: pos.top + pos.height * 0.66 +'px',
                left: pos.left + 20 + 'px',
                'max-width': window.innerWidth - pos.left - 50 + 'px',
            }}
            className="h-fit bg-[#e9e3d3] border-2 border-[#777] rounded-xl overflow-hidden break-all drop-shadow-2xl shadow-lg"
        >
            <p className="p-2 block "
                class={isPhish ? "bg-[#DD8888]" : "bg-[#88DD88]"}
            >{store.link}</p>
            <div className="flex w-full border-t-2 border-[#777] justify-end">
                <button
                    on:click={store.onCancel}
                    className="py-2 px-3 border-x-2 border-[#777] hover:cursor-pointer">Cancel</button>
                <button
                    on:click={() => window.open(store.link, '_blank')}
                    className="py-2 px-3 hover:cursor-pointer"
                    class={isPhish ? "bg-[#DD8888]" : "bg-[#88DD88]"}
                >
                    Open
                </button>
            </div>
        </div>
    )
}

export default Popup;
