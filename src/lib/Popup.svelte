<script lang="ts">
  let { isPhish = false, isPluginEnabled = false, children } = $props();
  let active = $state(false);

  const onmouseenter = () => { active = true; };
  const onmouseleave = () => { active = false; };
</script>

<button {onmouseenter} {onmouseleave}>{@render children()}</button>

{#if isPluginEnabled && active}
  <div {onmouseenter} {onmouseleave} class="p-4 bg-white absolute rounded-2xl drop-shadow-2xl shadow-lg translate-y-[-50%] flex flex-col"
  >
    <div class="flex items-center w-full space-x-2">
      {#if isPhish}
        <div class="rounded-lg p-1 px-2 bg-orange-400">http://</div>
        <div class="rounded-lg p-1 px-2 bg-red-400">doc-google.com</div>
      {:else}
        <div class="rounded-lg p-1 bg-green-400">https://</div>
        <div class="rounded-lg p-1 bg-green-400">docs.google.com</div>
      {/if}
      <span class="text-gray-400">
        /document/d/234fhs00cdsyh328yh
      </span>
    </div>

    <div class="self-end flex items-center mt-4 space-x-4">
      <button class="">Cancel</button>
      {#if isPhish}
        <button class="rounded-full p-2 px-4 bg-red-400 text-white">Open</button>
      {:else}
        <button class="rounded-full p-2 px-4 bg-blue-500 text-white">Open</button>
      {/if}
    </div>
  </div>
{:else if !isPluginEnabled && active}
  <div class="absolute bottom-0 left-0 p-1 bg-gray-500 text-white">
    {#if isPhish}
      http://doc-google.com/document/d/234fhs00cdsyh328yh
    {:else}
      https://docs.google.com/document/d/234fhs00cdsyh328yh
    {/if}
  </div>
{/if}
