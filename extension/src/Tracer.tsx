import { createEffect } from 'solid-js';
import { PopupStore } from './Popup';

function Tracer(props: { id: string, store: PopupStore }) {
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
            className="bg-red-700 opacity-30"
        ></div>
    )
}

export default Tracer;

