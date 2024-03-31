import { hex } from "./helpers.js";


export function parseLayer(l: string) {
    let [_, type, data, params]: any[] = l.match(/(\w+):([^;]+)(?:;(.+))?/) || ["", "", "", ""]

    params = params?.split(',')
        .filter(Boolean)
        .map((e: string) => {
            const [k, v] = e.split(':');
            return [k, v.startsWith("0x") ? hex(v) : (+v || v)];
        }) 

    return {
        $id: Math.floor(Math.random() * 1000),
        type,
        data,
        ...(params ? Object.fromEntries(params) : {}),
    };
}

export default function(searchParamsString: string) {

    let p = new URLSearchParams(searchParamsString)


    const [width, height] = p.get('s')?.split('x') || [ 100, 100 ];

    const fill = p.get("fill") || "#888888"

    const layers = p.get("l") !== null ? decodeURIComponent(p.get("l") || "")
        .split('|')
        .filter(Boolean)
        .map(parseLayer) : []

        return {
            width: +width,
            height: +height,
            fill: hex(fill),
            layers,
        }
}