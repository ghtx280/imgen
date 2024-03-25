import { writable } from "svelte/store";

export let config = writable({
    width: 400,
    height: 400,
    fill: '#888888',
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

export let current = writable(null)


export let images = writable({})


export let panelOpen = writable(false)