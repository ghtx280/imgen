import { redirect, type Handle } from "@sveltejs/kit";

// v1 is now secondary: consolidate human-facing pages onto v2 in search.
// API endpoints (/img image generation, /files) are intentionally left untouched.
const V2 = "https://imgenx.ghtx.me/";
const HUMAN_PATHS = new Set(["/", "/test"]);

export const handle: Handle = ({ event, resolve }) => {
    if (HUMAN_PATHS.has(event.url.pathname)) {
        throw redirect(301, V2);
    }
    return resolve(event);
};
