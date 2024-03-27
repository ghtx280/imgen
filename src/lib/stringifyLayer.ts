import { hex0x } from "./helpers";
import type { LayerBase } from "./types";

export function stringifyLayer(l: LayerBase) {
    return l.type +
    ':' +
    (typeof l.data == "string" ? l.data : l.data?.$name) +
    ';' +
    Object.entries(l)
        .map(([k, v]) => {
            if (k !== 'data' && k !== 'type' && !k.startsWith('$')) {
                return `${k}:${['c', 'bc'].includes(k) ? hex0x(v as string) : v}`;
            }
        })
        .filter(Boolean)
        .join(',')
}