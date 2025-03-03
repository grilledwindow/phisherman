import { onMount, createEffect, createSignal } from 'solid-js';
import Svg from './Svg';

type Pos = { left: number, top: number, width: number, height: number };
export type PopupStore = {
    pos: Pos,
    link: string,
    show: boolean,
    isPhish: boolean,
    onCancel: () => void
};

export function PopupHint(props: { id: string, store: PopupStore, position?: any }) {
    const store = props.store;
    const pos = store.pos;

    createEffect(() => {
        if (store.show) {
            const popup = document.getElementById(props.id);
            console.log(popup);
        }
    });

    // signals for expanding/collapsing long links
    const [linkElem, setLinkElem] = createSignal<HTMLElement>();
    const [linkExpanded, setLinkExpanded] = createSignal(false);
    const [linkExpandable, setLinkExpandable] = createSignal(false);

    // createMemo() and derived signals don't get proper updates but somehow createEffect() can...
    createEffect(() => {
        const elem = linkElem();
        // console.log('linkelem', elem?.offsetHeight, elem?.scrollHeight)
        const linkOverflow = elem.offsetHeight < elem.scrollHeight || elem.offsetWidth < elem.scrollWidth;
        setLinkExpandable(linkOverflow);
    });

    return (
        <div id={props.id}
            style={{
                display: store.show ? 'flex' : 'none',
                position: props.position || 'absolute',
                top: pos.top + pos.height * 0.66 +'px',
                left: pos.left + 20 + 'px',
                'max-width': window.innerWidth - pos.left - 50 + 'px',
            }}
            className="justify-between h-fit bg-[#e5e5e5] text-[#444] rounded-xl overflow-hidden break-all drop-shadow-2xl shadow-lg"
        >
        <div class={store.isPhish ? 'bg-red' : 'bg-green'}
            className="min-w-3"></div>

        <div className="p-2 pb-3">
            <div className="ml-1 mt-1 flex items-center space-x-2">
                <span className="inline-block w-[2rem]"><Svg isPhish={store.isPhish} fill={ store.isPhish ? "var(--red)" : "var(--green)" } />
                </span>
                <span className="translate-y-[5%]">
                    { store.isPhish ? 'Phishing link detected!' : 'Link is safe :)' }
                </span>
            </div>
            <div className="p-2">
                <p className="font-link mt-1" ref={setLinkElem}
                    class={linkExpanded() ? 'line-clamp-none' : 'line-clamp-2'}
                >{store.link}</p>
                <button
                    style={{ display: linkExpandable() ? 'block' : 'none' }}
                    className="mt-2 text-[#747474] hover:cursor-pointer"
                    on:click={() => setLinkExpanded(v => !v)}
                >{ linkExpanded() ? 'See less' : 'See more' }</button>
            </div>
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
    </div>
    )
}

export default PopupHint;

