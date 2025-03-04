import { onMount, createEffect, createSignal, Show, createMemo } from 'solid-js';
import { PopupStore } from './PopupHint';
import Svg from './Svg';
import { createStore } from 'solid-js/store';
import { CheckCircle, ErrorCircle } from './svg/icons';
import { Dynamic } from 'solid-js/web';

export function PopupBorder(props: { id: string, store: PopupStore, position?: any }) {
    const store = props.store;
    const pos = store.pos;

    createEffect(() => {
        if (store.show) {
            const popup = document.getElementById(props.id);
            console.log(popup);
        }
    });

    const getIcon = createMemo(() => {
        return store.isPhish
            ? { icon: ErrorCircle, fill: '--var(red)' }
            : { icon: CheckCircle, fill: '--var(green)' };
    });

    const bgColour = () => store.isPhish ? 'bg-red' : 'bg-green';

    // signals for expanding/collapsing long links
    const [linkElem, setLinkElem] = createSignal<HTMLElement>();
    const [linkExpanded, setLinkExpanded] = createSignal(false);
    const [linkExpandable, setLinkExpandable] = createSignal(false);

    // createMemo() and derived signals don't get proper updates but somehow createEffect() can...
    createEffect(() => {
        if (!store.show || linkExpanded()) {
            return;
        }
        const elem = linkElem();
        const linkOverflow = elem.offsetHeight < elem.scrollHeight || elem.offsetWidth < elem.scrollWidth;
        setLinkExpandable(linkOverflow);
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
            class="h-fit bg-[#e5e5e5] border-2 border-[#777] text-[#444] rounded-md overflow-hidden break-all drop-shadow-2xl shadow-lg"
        >
            <div class="border-b-2 border-[#777] flex items-center">
                <div class={"p-2 w-fit border-r-2 border-[#777] fill-[#777] " + bgColour()}
                >
                    <span class="inline-block w-[1.6rem]">
                        <Dynamic component={getIcon().icon} fill="#666" />
                    </span>
                </div>
                <div class="ml-2 translate-y-[5%]">
                    { store.isPhish ? 'Phishing link detected!' : 'Link is safe :)' }
                </div>
            </div>
            <div class="p-2">
                <button
                    class="my-1 text-[#747474] hover:cursor-pointer"
                    classList={{ 'hidden': !linkExpandable() }}
                    on:click={() => setLinkExpanded(v => !v)}
                >{ linkExpanded() ? 'See less' : 'See more' }</button>
                <p ref={setLinkElem}
                    class="font-link"
                    classList={{ 'line-clamp-2': !linkExpanded() }}
                >{store.link}</p>
            </div>
            <div class="flex w-full border-t-2 border-[#777] justify-end">
                <button
                    on:click={store.onCancel}
                    class="py-2 px-3 border-x-2 border-[#777] hover:cursor-pointer">Cancel</button>
                <button
                    on:click={() => window.open(store.link, '_blank')}
                    class={"py-2 px-3 hover:cursor-pointer " + bgColour()}
                >
                    Open
                </button>
            </div>
        </div>
    )
}

export default PopupBorder;
