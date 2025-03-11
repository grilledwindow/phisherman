export type PopupStore = {
    show: boolean,
    onCancel: () => void,
    onToggleExtension: (checked: boolean) => void
};
export function Popup(props: { store: PopupStore }) {
    const store = props.store;

    return (
        <div 
            class="min-w-[300px] h-fit p-3 bg-[#e5e5e5] text-[#444] rounded-xl overflow-hidden drop-shadow-2xl shadow-lg"
            style={{
                position: 'fixed',
                display: store.show ? 'block' : 'none',
                top: '1rem',
                left: 'auto',
                right: '1rem',
            }}
        >
            <h1 class="text-xl font-semibold">Phisherman</h1>
            <div class="mt-2">
                <input type="checkbox" name="Toggle extension" id="toggle-extension"
                    checked={store.show}
                    class="h-3 w-3 mr-2 appearance-none outline-none rounded-full cursor-pointer ring-[1.5px] ring-[#555] checked:bg-[#555]"
                    on:change={(e) => store.onToggleExtension(e.currentTarget.checked)}
                />
                <label for="toggle-extension">Enable extension</label>
            </div>
            <p class="mt-4">
                This email is...
            </p>
        </div>
    )
}

export default Popup;
