import { For, Show } from "solid-js";
import { WarningCone } from "../svg/icons";

export type PopupStore = {
    show: boolean,
    enabled: () => boolean,
    onCancel: () => void,
    onToggleExtension: (checked: boolean) => void
};
export function Popup(props: { store: PopupStore }) {
    const store = props.store;
    // hardcoded for now
    const findings = ['Threatening language detected', 'Asking for sensitive information', 'Suspicious email'];

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
                    checked={store.enabled()}
                    class="h-3 w-3 mr-2 appearance-none outline-none rounded-full cursor-pointer ring-[1.5px] ring-[#555] checked:bg-[#555]"
                    on:change={(e) => store.onToggleExtension(e.currentTarget.checked)}
                />
                <label for="toggle-extension">Enable extension</label>
            </div>

            {/* email findings: warnings, errors */}
            <Show when={store.enabled()}>
                <div class="mt-2">
                <For each={findings}>{(finding, i) =>
                    <div class="mt-2 flex items-end space-x-2">
                    <span class="inline-block w-[1.6rem]">
                    <WarningCone fill="var(--yellow)" />
                    </span>
                    <span>{finding}</span>
                    </div>
                }</For>
                </div>
            </Show>
        </div>
    )
}

export default Popup;
