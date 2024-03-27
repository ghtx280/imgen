<script>
    import { flip } from 'svelte/animate';
    import { fade } from 'svelte/transition';
    import PanelLayerBtn from './PanelLayerBtn.svelte';
    import { config, current } from '$lib/store.js';
    import Input from '$lib/ui/Input.svelte';
    import icon from '$lib/icon.js';
    import { parseLayer } from '$lib/parseConfig';

    export let saveUrl;

    const add = {
        txt() {
            // console.log($config.layers[$current]);
            $config.layers.push({
                $id: Math.floor(Math.random() * 1000),
                type: 'txt',
                data: 'lorem ipsum',
                x: 0,
                y: 0,
                c: '#000000',
                s: '24',
                r: 0,
                o: 'st'
            });

            $config.layers = $config.layers;
        },
        img() {
            $config.layers.push({
                $id: Math.floor(Math.random() * 1000),
                type: 'img',
                data: 'https://placehold.co/100',
                x: 50,
                y: 50,
                w: 100,
                h: 100,
                r: 0,
                rd: 0,
                o: 'cm'
            });

            $config.layers = $config.layers;
        },
        shp() {
            $config.layers.push({
                $id: Math.floor(Math.random() * 1000),
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

            $config.layers = $config.layers;
        },
        raw() {
            const code = prompt('Enter layer code');

            if (code) {
                const layer = parseLayer(code);

                if (layer) {
                    $config.layers.push(layer);

                    $config.layers = $config.layers;
                }
            }
        }
    };
</script>

<div flex="20" class="mt-10">
    <input type="color" bind:value={$config.fill} />
    <Input label="w" bind:value={$config.width} />
    <Input label="h" bind:value={$config.height} />
</div>

<hr />

<div>
    <!-- <span>Add</span> -->
    <div flex="15 ai-c" class="mt-10">
        <span>Add</span>
        <button class="btn" on:click={add.img}>{@html icon.image(20)}</button>
        <button class="btn" on:click={add.txt}>T</button>
        <button class="btn" on:click={add.shp}>{@html icon.square(20)}</button>
        <button class="btn" on:click={add.raw}>{@html icon.code(20)}</button>
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
