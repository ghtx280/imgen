import { hex } from "./helpers.js";

export default function(searchParamsString: string) {

    let p = new URLSearchParams(searchParamsString)


    const [width, height] = p.get('s')?.split('x') || [ 100, 100 ];

    const fill = p.get("fill") || "#888888"

    const layers = p.get("l") !== null ? decodeURIComponent(p.get("l") || "")
        .split('|')
        .filter(Boolean)
        .map((e) => {
            let [_, type, data, params]: any[] = e.match(/(\w+):([^;]+)(?:;(.+))?/) || ["", "", "", ""]

            params = params?.split(',')
                .filter(Boolean)
                .map((e: string) => {
                    const [k, v] = e.split(':');
                    return [k, v.startsWith("0x") ? hex(v) : (+v || v)];
                }) 

            return {
                type,
                data,
                ...(params ? Object.fromEntries(params) : {}),
            };
        }) : []

        return {
            width: +width,
            height: +height,
            fill: hex(fill),
            layers,
        }
}