import { onMount, createEffect, createSignal, Show, createMemo } from 'solid-js';
import { PopupStore } from './PopupHint';
import Svg from './Svg';

export function PopupBorder(props: { id: string, store: PopupStore, position?: any }) {
    const store = props.store;
    const pos = store.pos;

    createEffect(() => {
        if (store.show) {
            const popup = document.getElementById(props.id);
            console.log(popup);
        }
    });

    const bgColour = () => store.isPhish ? 'bg-red' : 'bg-green';

    // createMemo() and derived signals don't get proper updates but somehow createEffect() can...
    const [readMore, setReadMore] = createSignal(false);
    const [linkElem, setLinkElem] = createSignal<HTMLElement>();
    createEffect(() => {
        const elem = linkElem();
        // console.log('linkelem', elem?.offsetHeight, elem?.scrollHeight)
        setReadMore(elem.offsetHeight < elem.scrollHeight || elem.offsetWidth < elem.scrollWidth);
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
            <div className="border-b-2 border-[#777] flex items-center">
                <div className="p-2 w-fit border-r-2 border-[#777] fill-[#777]"
                    class={bgColour()}
                >
                    <span className="inline-block w-[1.6rem]"><Svg isPhish={store.isPhish} fill="#666" /></span>
                </div>
                <div className="ml-2 translate-y-[5%]">
                    { store.isPhish ? 'Phishing link detected!' : 'Link is safe :)' }
                </div>
            </div>
            <div className="p-2">
                <p className="font-link line-clamp-2" ref={setLinkElem}
                >{store.link}</p>
                <button style={{ display: readMore() ? 'block' : 'none' }}>Read more</button>
            </div>
            <div className="flex w-full border-t-2 border-[#777] justify-end">
                <button
                    on:click={store.onCancel}
                    className="py-2 px-3 border-x-2 border-[#777] hover:cursor-pointer">Cancel</button>
                <button
                    on:click={() => window.open(store.link, '_blank')}
                    className="py-2 px-3 hover:cursor-pointer"
                    class={bgColour()}
                >
                    Open
                </button>
            </div>
        </div>
    )
}

export default PopupBorder;
