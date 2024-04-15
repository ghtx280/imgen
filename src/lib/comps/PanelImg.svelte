<script>
    import { slide } from 'svelte/transition';
    import { config, current } from '$lib/store';
    import { onMount } from 'svelte';
    import Input from '$lib/ui/Input.svelte';
    import Move from '$lib/ui/Move.svelte';
    import Scale from '$lib/ui/Scale.svelte';
    import Origin from '$lib/ui/Origin.svelte';
    import Color from '$lib/ui/Color.svelte';
    import icon from '$lib/icon.js';

    // $: $config.layers[$current] ||= '';

    let img = $config.layers[$current]?.data || {};

    let imgName = img.$name;
    let imgElem = img.$elem;

    async function setImg() {
        const dec = decodeURIComponent(imgName);

        $config.layers[$current].data = {
            $name: dec,
            $elem: await loadImage(dec)
        };
    }

    let showAllRounds = false;
</script>

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
    <Input label="⟳" bind:value={$config.layers[$current].r} min={-360} max={360} />
    <Input label="r" bind:value={$config.layers[$current].rd} min={0} />

    <button class="rel sq-35 b-1" flex="center" on:click={() => (showAllRounds = !showAllRounds)}>
        {@html icon.maximize(21, '#eee', 1.5)}
    </button>
</div>

{#if showAllRounds}
    <div class="my-10">
        <div grid="cols-2 10 ai-c" class=" max-w-0" transition:slide={{ duration: 50 }}>
            <Input label="╭" bind:value={$config.layers[$current].rdtl} min={0} />
            <Input label="╮" bind:value={$config.layers[$current].rdtr} min={0} />
            <Input label="╰" bind:value={$config.layers[$current].rdbl} min={0} />
            <Input label="╯" bind:value={$config.layers[$current].rdbr} min={0} />
        </div>
    </div>
{/if}

<hr />

<div class="">
    <span>Image</span>
    <div flex="10 ai-c" class="mt-10">
        <input type="text" class="px-20 h-40 b-1 w-full" bind:value={imgName} />
        <button class="px-20 h-40 b-1 c-0 bg-f fs-16" on:click={setImg}>set</button>
    </div>
</div>

<hr />

<div class="">
    <span>Border</span>
    <div flex="10 ai-c" class="mt-10">
        <Input label="w" bind:value={$config.layers[$current].bw} min={0} />
        <Color bind:value={$config.layers[$current].bc} />
    </div>
</div>

<hr />

<Origin />
