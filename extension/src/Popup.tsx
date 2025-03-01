import { onMount, createEffect } from 'solid-js';

function Popup(props) {
    const pos = props.pos;
    const link = props.link;
    const isLink = props.isLink;
    const isPhish = props.isPhish;
    const id = props.id;
    const onCancel = props.onCancel;

    createEffect(() => {
        if (isLink()) {
            const popup = document.getElementById(id);
            console.log(popup);
        }
    });

    return (
        <div id={props.id}
            style={{
                display: isLink() ? 'block' : 'none',
                position: 'absolute',
                top: pos.top + pos.height * 0.66 +'px',
                left: pos.left + 20 + 'px',
                'max-width': window.innerWidth - pos.left - 50 + 'px',
            }}
            className="h-fit bg-[#e9e3d3] border-2 border-[#777] rounded-xl overflow-hidden break-all drop-shadow-2xl shadow-lg"
        >
            <p className="p-2 block "
                class={isPhish() ? "bg-[#DD8888]" : "bg-[#88DD88]"}
            >{link()}</p>
            <div className="flex w-full border-t-2 border-[#777] justify-end">
                <button
                    on:click={onCancel}
                    className="py-2 px-3 border-x-2 border-[#777] hover:cursor-pointer">Cancel</button>
                <button
                    on:click={() => window.open(link(), '_blank')}
                    className="py-2 px-3 hover:cursor-pointer"
                    class={isPhish() ? "bg-[#DD8888]" : "bg-[#88DD88]"}
                >
                    Open
                </button>
            </div>
        </div>
    )
}

export default Popup;
