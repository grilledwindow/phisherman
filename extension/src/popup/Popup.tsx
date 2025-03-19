import { For, Show } from "solid-js";
import { WarningCone } from "../svg/icons";
import Toggle from "./Toggle";

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
            class="min-w-[320px] h-fit p-3 bg-[#e5e5e5] text-[#444] rounded-xl overflow-hidden drop-shadow-2xl shadow-lg"
            style={{
                position: 'fixed',
                display: store.show ? 'block' : 'none',
                top: '1rem',
                left: 'auto',
                right: '1rem',
            }}
        >
            <span class="text-xl align-bottom font-semibold mr-2">
                Phisherman 
                <Toggle checked={store.enabled()} onToggle={(e) => store.onToggleExtension(e.currentTarget.checked)} />
            </span>

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
