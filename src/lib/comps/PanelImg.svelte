<script>
    import { browser } from '$app/environment';
    import { config, current, images } from '$lib/store.js';
    import { onMount } from 'svelte';
    import Input from './Input.svelte';
    import Move from './Move.svelte';
    import Scale from './Scale.svelte';

    $: $config.layers[$current] ||= {};

    let img = $config.layers[$current].data;
    let imgName = img;
    let imgElem = null;

    if (img.$name) {
        imgName = img.$name;
        imgElem = img.$elem;
    }

    async function setImg() {
        $config.layers[$current].data = {
            $name: imgName,
            $elem: await loadImage(imgName),
        };
    }

    onMount(() => {
        setImg();
    });
</script>

<div flex="10 ai-c">
    <input type="text" class="px-20 h-40 r-5 b-1 w-full" bind:value={imgName} />
    <button class="px-20 h-40 r-5 b-1" on:click={setImg}> set </button>
</div>

<div flex="10 ai-c" class="mt-10">
    <Input label="x" bind:value={$config.layers[$current].x} />
    <Input label="y" bind:value={$config.layers[$current].y} />

    <Move />
</div>

<div flex="10 ai-c" class="mt-10">
    <Input label="w" bind:value={$config.layers[$current].w} />
    <Input label="h" bind:value={$config.layers[$current].h} />

    <Scale />
</div>

<div flex="10 ai-c" class="mt-10">
    <Input
        label="⟳"
        bind:value={$config.layers[$current].r}
        min={0}
        max={360}
    />
    <Input label="r" bind:value={$config.layers[$current].rd} min={0} />
</div>
