<script>
    import PanelLayerBtn from './PanelLayerBtn.svelte';
    import { config, current } from '$lib/store.js';
    import Input from './Input.svelte';

    export let saveUrl;

    const add = {
        txt() {
            // console.log($config.layers[$current]);
            $config.layers.push({
                type: 'txt',
                data: 'lorem ipsum',
                x: 0,
                y: 0,
                c: '#000000',
                s: '24',
                r: 0,
            });

            $config.layers = $config.layers;
        },
        img() {
            $config.layers.push({
                type: 'img',
                data: 'https://placehold.co/100',
                x: 50,
                y: 50,
                w: 100,
                h: 100,
                r: 0,
                rd: 0,
            });

            $config.layers = $config.layers;
        },
    };
</script>



<div flex="20" class="mt-10">
    <input type="color" bind:value={$config.fill} />
    <Input label="w" bind:value={$config.width} />
    <Input label="h" bind:value={$config.height} />
</div>

<div flex="20" class="mt-10">
    <button class="btn" on:click={add.img}>Add Img</button>
    <button class="btn" on:click={add.txt}>Add Txt</button>
</div>

<div class="mt-20" flex="20 col">
    {#each $config.layers || [] as item, index}
        <PanelLayerBtn {index} {item} />
    {/each}
</div>
