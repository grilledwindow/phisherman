import { Show, createEffect } from 'solid-js';

function Tracer(props) {
    const pos = props.pos;
    const isLink = props.isLink;
    // console.log(isLink);

    return (
        <Show when={isLink()}>
            <div id={props.id}
                style={{ position: 'absolute', top: pos.top +'px', left: pos.left + 'px', width: pos.width + 'px', height: pos.height + 'px' }}
                class="bg-red-700 opacity-50"
            ></div>
        </Show>
    )
}

export default Tracer;

