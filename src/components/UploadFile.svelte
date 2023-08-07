<script lang="ts">
    import { uploadFile } from "./upload-state.service";
    
    async function upload(event) {
        const element: HTMLInputElement = event.target as any;
        if (element?.files) {
            const files: FileList = element.files;
            if (files.length) {
                for (let i = 0; i < files.length; i++) {
                    const id = await uploadFile(files[i]);
                }
            }
        }
    }
</script>
<div class="relative border border-gray-200/20 p-4 rounded w-[24rem] h-[16rem]">
    <div class="flex items-center justify-center w-full h-full border-2 rounded border-dashed border-gray-200/50">
        <p>Click or Drop file to Upload</p>
    </div>
    <input type="file" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" on:change={upload} />
</div>