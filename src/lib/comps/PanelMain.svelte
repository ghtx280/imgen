<script>
    import { flip } from 'svelte/animate';
    import { fade } from 'svelte/transition';
    import PanelLayerBtn from './PanelLayerBtn.svelte';
    import { config, current } from '$lib/store';
    import Input from '$lib/ui/Input.svelte';
    import icon from '$lib/icon.js';
    import { parseLayer } from '$lib/parseConfig';
    import Color from '$lib/ui/Color.svelte';

    export let saveUrl;

    async function addLayer(layer) {
        $config.layers.push({
            $id: Math.floor(Math.random() * 1000),
            ...layer
        });
        $config.layers = $config.layers;
        $current = $config.layers.length - 1;
    }

    const add = {
        async txt() {
            await addLayer({
                type: 'txt',
                data: 'lorem ipsum',
                x: 0,
                y: 0,
                c: '#000000',
                s: 24,
                r: 0,
                o: 'st',
                lh: 15
            });
        },
        async img() {
            await addLayer({
                type: 'img',
                data: {
                    $name: 'https://placehold.co/100',
                    $elem: await loadImage('https://placehold.co/100')
                },
                x: 50,
                y: 50,
                w: 100,
                h: 100,
                r: 0,
                rd: 0,
                o: 'cm'
            });
        },
        async shp() {
            await addLayer({
                type: 'shp',
                data: 'rect',
                x: 50,
                y: 50,
                w: 100,
                h: 100,
                c: '#555555',
                r: 0,
                rd: 0,
                o: 'st'
            });
        },
        async raw() {
            const code = prompt('Enter layer code');

            if (code) {
                const layer = parseLayer(code);

                if (layer) {
                    await addLayer(layer);
                } else {
                    alert('Invalid layer code');
                }
            }
        }
    };
</script>

<div>
    <span>Canvas</span>
    <div flex="20 ai-c" class="mt-20">
        <Input label="w" bind:value={$config.width} min={0} max={2000} />
        <Input label="h" bind:value={$config.height} min={0} max={2000} />
        <Color bind:value={$config.fill} />
    </div>
    <div flex="20 ai-c" class="mt-10"></div>
</div>

<hr />

<div>
    <!-- <span>Add</span> -->
    <div flex="15 ai-c" class="mt-10">
        <span>Add</span>
        <button class="btn" on:click={add.img}>{@html icon.image(20, '#fff', 1)}</button>
        <button class="btn" on:click={add.txt}>{@html icon.type(20, '#fff', 1)}</button>
        <button class="btn" on:click={add.shp}>{@html icon.square(20, '#fff', 1)}</button>
        <button class="btn" on:click={add.raw}>{@html icon.code(20, '#fff', 1)}</button>
    </div>
</div>

<hr />

<div class="mt-20" flex="20 col">
    {#each $config.layers || [] as item, index (item.$id)}
        <div animate:flip={{ duration: 200 }}>
            <PanelLayerBtn {index} {item} />
        </div>
    {/each}
</div>

<style>
    .btn {
        width: 32px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
    }
</style>
