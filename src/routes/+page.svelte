<script>
  import Popup from "$lib/Popup.svelte";
  import docIcon from "$lib/assets/google-doc-icon.png";
  import starIcon from "$lib/assets/google-star-icon.svg";
  import personIcon from "$lib/assets/google-person-icon.svg";
  import historyIcon from "$lib/assets/google-history-icon.svg";

  let documentTitle = $state("Untitled");
  let ownerName = $state("John Paul");
  let ownerEmail = $state("johnpaul@gmail.com");

  let isPluginEnabled = $state(false);
  let isPhish = $state(true);
</script>

<div class="w-[90%] mx-auto">
  <div class="w-[90%] my-4 space-x-4">
    <label>
      <input type="checkbox" bind:checked={isPluginEnabled} />
      Enable plugin
    </label>

    <label>
      <input type="checkbox" bind:checked={isPhish} />
      Use phishing link
    </label>
  </div>

  <div class="w-[90%] my-4 space-x-4">
      <input type="text" bind:value={documentTitle} placeholder="documentTitle" class="p-2 border border-gray-200" />
      <input type="text" bind:value={ownerName} placeholder="ownerName" class="p-2 border border-gray-200" />
      <input type="text" bind:value={ownerEmail} placeholder="ownerEmail" class="p-2 border border-gray-200" />
  </div>

  <div class="max-w-800px self-center p-6 bg-white rounded-xl shadow-md border border-gray-200">
    <!-- Header -->
    <div class="flex w-full">

      <div class="self-start rounded-full bg-blue-400 h-[3rem] w-[3rem] text-[1.5rem] flex justify-center items-center">
        <span class="text-white">L</span>
      </div>

      <!-- From -->
      <div class="ml-4 self-start">
        <div class="">
          <span >{ownerName}</span>
          <span class="text-gray-400">{ownerEmail}</span>
        </div>
        <div class="">
          <span class="text-gray-400">to me</span>
        </div>
      </div>

      <!-- Time -->
      <div class="ml-auto self-center"><span class="text-gray-400">1:53 PM</span></div>
    </div>

    <!-- Body -->
    <div class="m-4 p-8 border border-gray-200 rounded-xl">
      <h1 class="text-2xl text-gray-800">{ownerName} shared a document</h1>

      <div class="flex mt-8 items-center">
        <div class="rounded-full bg-blue-400 h-[3rem] w-[3rem] text-[1.5rem] flex justify-center items-center">
          <span class="text-white">L</span>
        </div>
        <p class="ml-4">{ownerName} ({ownerEmail}) has invited you to <strong>edit</strong> the following document:</p>
      </div>
      <!-- Embedded doc details -->
      <div class="mt-4 p-4 w-2/3 border border-gray-200 rounded-xl flex flex-col">
        <div class="flex items-center space-x-2">
          <Popup {isPhish} {isPluginEnabled}>
            <img src={docIcon} alt="" class="w-4" />
          </Popup>
          <span class="">{documentTitle}</span>
          <Popup {isPhish} {isPluginEnabled}>
            <img src={starIcon} alt="" class="w-5" />
          </Popup>
        </div>

        <Popup {isPhish} {isPluginEnabled}>
          <div class="mt-4 p-4 w-full h-[25vh] border border-gray-200 rounded-xl flex justify-center items-center">
            <img src={docIcon} alt="" class="w-16" />
          </div>
        </Popup>

        <div class="mt-6 mb-3 flex flex-col text-gray-600 space-y-3">
          <p class="flex items-center">
            <Popup {isPhish} {isPluginEnabled}>
                <img src={personIcon} alt="" class="mr-4 w-6" />
            </Popup>
            {ownerName} is the owner
          </p>
          <p class="flex items-center">
            <Popup {isPhish} {isPluginEnabled}>
              <img src={historyIcon} alt="" class="mr-4 w-6" />
            </Popup>
            Last edited by {ownerName} 1 hour ago
          </p>
        </div>
      </div>

      <Popup {isPhish} {isPluginEnabled}>
        <button class="mt-8 p-2 px-6 rounded-full flex justify-center items-center bg-blue-500 text-white">
          Open
        </button>
      </Popup>
    </div>
  </div>
</div>
