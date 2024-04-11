import type { Handle } from "@sveltejs/kit";

export const handle: Handle = ({ event, resolve }) => {
    console.log(event.url.toString());
    return resolve(event);
}