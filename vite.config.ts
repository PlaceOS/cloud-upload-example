import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { viteStaticCopy } from "vite-plugin-static-copy";

const server = "https://dev.place.tech";

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        proxy: {
            "/api": {
                target: `${server}`,
                changeOrigin: true,
            },
            "/auth": {
                target: `${server}`,
                changeOrigin: true,
            },
        },
    },
    plugins: [
        svelte(),
        viteStaticCopy({
            targets: [
                {
                    src: "node_modules/ts-md5/dist/md5_worker.js",
                    dest: "assets",
                },
            ],
        }),
    ],
});
