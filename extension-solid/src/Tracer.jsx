import { createEffect } from 'solid-js';

function Tracer(props) {
    const pos = props.pos;
    const isLink = props.isLink;

    return (
        <div id={props.id}
            style={{
                display: isLink() ? 'block' : 'none',
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

