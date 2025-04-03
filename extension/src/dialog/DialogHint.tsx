import { onMount, createEffect, createSignal, createMemo } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { CheckCircle, ErrorCircle, Loader } from '../svg/icons';

type Pos = { left: number, top: number, width: number, height: number };
type LinkStates = 'safe' | 'unsafe' | 'loading';
export type DialogStore = {
    pos: Pos,
    link: string,
    show: boolean,
    state: LinkStates,
    onCancel: () => void
};

export function DialogHint(props: { id: string, store: DialogStore, position?: any }) {
    const store = props.store;
    const pos = store.pos;

    const stateMap: { [key in LinkStates]: { icon: any, fill: string, bg: string, hint: string } } = {
        'safe': {
            icon: CheckCircle,
            fill: 'var(--green)',
            bg: 'bg-green',
            hint: 'Link is safe :)'
        },
        'unsafe': {
            icon: ErrorCircle,
            fill: 'var(--red)',
            bg: 'bg-red',
            hint: 'Link seems unsafe!'
        },
        'loading': {
            icon: Loader,
            fill: '#bbb',
            bg: 'bg-[#bbb]',
            hint: 'Loading...'
        },
    }

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
                display: store.show ? 'flex' : 'none',
                position: props.position || 'absolute',
                top: pos.top + pos.height * 0.66 +'px',
                left: pos.left + 20 + 'px',
                'max-width': window.innerWidth - pos.left - 50 + 'px',
            }}
            class="justify-between h-fit bg-[#e5e5e5] text-[#444] rounded-xl overflow-hidden break-all drop-shadow-2xl shadow-lg"
        >
        <div class={"min-w-3 " + stateMap[store.state].bg}></div>

        <div class="p-2 pb-3">
            <div class="ml-1 mt-1 flex items-center space-x-2">
                <span class="inline-block w-[2rem]">
                    <Dynamic component={stateMap[store.state].icon} fill={stateMap[store.state].fill} />
                </span>
                <span class="translate-y-[5%]">
                    {stateMap[store.state].hint}
                </span>
            </div>
            <div class="p-2">
                <button
                    class="mt-2 text-[#747474] hover:cursor-pointer"
                    classList={{ 'hidden': !linkExpandable() }}
                    on:click={() => setLinkExpanded(v => !v)}
                >{ linkExpanded() ? 'Collapse link' : 'Expand link' }</button>
                {/* ref using signal because dimensions aren't propagated properly otherwise */}
                <p ref={setLinkElem}
                    class="font-link mt-1"
                    classList={{ 'line-clamp-2': !linkExpanded() }}
                >{store.link}</p>
            </div>
            <div class="flex w-full space-x-2 justify-end">
                <button
                    on:click={store.onCancel}
                    class="py-2 px-3 hover:cursor-pointer">Cancel</button>
                <button
                    on:click={() => window.open(store.link, '_blank')}
                    class={"py-2 px-3 rounded-full hover:cursor-pointer " + stateMap[store.state].bg}
                >
                    Open
                </button>
            </div>
        </div>
    </div>
    )
}

export default DialogHint;

