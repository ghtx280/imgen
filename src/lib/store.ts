import { writable } from "svelte/store";
import type { LayerImg, LayerShp, LayerTxt } from "./types";

export let config = writable<{
    width: number,
    height: number,
    fill: string,
    layers: (LayerImg | LayerShp | LayerTxt)[] 
}>({
    width: 400,
    height: 400,
    fill: '#888888',
    // sel: -1,
    layers: [
        // {
        //     type: 'txt',
        //     data: "lorem",
        //     x: 200,
        //     y: 200,
        //     c: 'red',
        //     s: 50,
        //     o: "cm"
        // },
        // {
        //     type: 'txt',
        //     data: "gfgf",
        //     x: 100,
        //     y: 100,
        //     c: 'blue',
        //     s: 48,
        //     o: "cm"
        // },
    ],
})

export let current = writable<null | number>(null)


// export let images = writable({})


// export let panelOpen = writable(false)