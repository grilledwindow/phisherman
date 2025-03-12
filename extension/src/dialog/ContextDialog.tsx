import { createEffect, createSignal } from 'solid-js';
import { ErrorCircle } from '../svg/icons';
import { DialogStore } from './DialogHint';

export function ContextDialog(props: { store: DialogStore }) {
    const store = props.store;
    const pos = store.pos;
    const [ref, setRef] = createSignal<HTMLDivElement>();
    const [top, setTop] = createSignal('');
    createEffect(() => {
        // just like in DialogHint, store.show is needed to properly trigger this...
        if (!store.show) return;
        setTop(pos.top - pos.height / 3 - ref()?.offsetHeight +'px')
    });

    return (
        <div ref={setRef}
        style={{
            display: store.show ? 'flex' : 'none',
            position: 'absolute',
            top: top(),
            left: pos.left + 20 + 'px',
            'max-width': window.innerWidth - pos.left - 50 + 'px',
        }}
        class="justify-between h-fit bg-[#e5e5e5] text-[#444] rounded-md overflow-hidden break-words drop-shadow-2xl shadow-lg"
        >
        {/* <div class="min-w-2 bg-red"></div> */}

        <div class="p-1 pr-2">
            <div class="ml-1 mt-1 flex items-start space-x-2">
                <span class="inline-block w-[1.5rem] min-w-[1.5rem]">
                    <ErrorCircle fill="var(--red)" />
                </span>
                <span class="">
                    {store.link}
                </span>
            </div>
        </div>
    </div>
    )
}

export default ContextDialog;


