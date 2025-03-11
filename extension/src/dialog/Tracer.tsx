import { createEffect } from 'solid-js';
import { DialogStore } from './DialogHint';

function Tracer(props: { id: string, store: DialogStore }) {
    const store = props.store;
    const pos = store.pos;

    return (
        <div id={props.id}
            style={{
                display: store.show ? 'block' : 'none',
                position: 'absolute',
                top: pos.top +'px',
                left: pos.left + 'px',
                width: pos.width + 'px',
                height: pos.height + 'px'
            }}
            class="bg-red-700 opacity-30"
        ></div>
    )
}

export default Tracer;

