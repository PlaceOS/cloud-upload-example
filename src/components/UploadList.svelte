<script lang="ts">
    import { upload_list } from "./upload-state.service"; 
</script>
<div class="relative border border-gray-200/20 rounded w-[24rem]">
    {#if $upload_list.length}
        {#each $upload_list as upload}
            <a href={upload.link} class="flex items w-full p-4 rounded hover:bg-white/10 space-x-2 text-white">
                <div class="truncate flex-1 w-1/2">{upload.name}</div>
                <div class="opacity-60">{upload.formatted_size}</div>
                <div>{upload.progress >= 100 ? '✅' : upload.error ? '❌' : upload.progress + '%'}</div>
            </a>
        {/each}
    {:else}
        <p class="w-full text-center opacity-30 p-4" >No uploads</p>
    {/if}
</div>