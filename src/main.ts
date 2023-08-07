import "./app.css";
import App from "./App.svelte";
import { initialiseUploadService, Amazon } from "@placeos/cloud-uploads";

/**
 * Convert map into a query string
 * @param map Key value pairs to convert
 */
export function toQueryString(map: Record<string, any>) {
    let str = "";
    if (map) {
        for (const key in map) {
            if (
                map.hasOwnProperty(key) &&
                map[key] !== undefined &&
                map[key] !== null
            ) {
                str += `${str ? "&" : ""}${key}=${encodeURIComponent(
                    map[key]
                )}`;
            }
        }
    }
    return str;
}

async function bootstrap() {
    const query = {
        grant_type: "password",
        client_id: ``,
        client_secret: ``,
        redirect_uri: `http://localhost:5123/oauth-resp.html`,
        authority: ``,
        scope: "public",
        username: ``,
        password: ``,
    };
    const resp = await fetch(`/auth/oauth/token`, {
        method: "POST",
        body: toQueryString(query),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    const data = await resp.json();
    initialiseUploadService({
        auto_start: true,
        token: data.access_token,
        endpoint: `/api/files/v1/uploads`,
        worker_url: "assets/md5_worker.js",
        providers: [Amazon] as any,
    });
}

bootstrap();

const app = new App({
    target: document.getElementById("app"),
});

export default app;
