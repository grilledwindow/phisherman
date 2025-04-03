export function Toggle(props: { checked: boolean, onToggle: (e) => void }) {
    return (
        <label class="">
            <input type="checkbox" checked={props.checked} on:change={props.onToggle} class="sr-only peer" />
            <div class="slider appearance-none w-[2.3rem] h-[1.5rem] p-[0.25rem] bg-[#888] rounded-full relative cursor-pointer
                inline-flex items-center peer-checked:justify-end peer-checked:bg-[#8da8ff]">
                <div class="circle h-full aspect-square bg-[#ddd] rounded-full"></div>
            </div>
        </label>
    );
}

export default Toggle;
