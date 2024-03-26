<script>
    import { config, current } from '$lib/store.js';
    import { hex } from '../../routes/img/helpers.js';
    import Input from './Input.svelte';
    import Move from './Move.svelte';
    import PanelOrigin from './PanelOrigin.svelte';
    import TextArea from './TextArea.svelte';

    // export let current = 0

    // $: console.log(current);

    // let data = $config.layers[$current] || {}

    // $: $config.layers[$current] = data
    // // let data, x, y, s, r, w, o

    // console.log($config.layers[$current]);

    $: $config.layers[$current] ||= {};
</script>

<TextArea bind:value={$config.layers[$current].data} />

<div flex="10 ai-c" class="mt-20">
    <Input label="x" bind:value={$config.layers[$current].x} />
    <Input label="y" bind:value={$config.layers[$current].y} />

    <Move />
</div>

<div flex="10 ai-c" class="mt-10">
    <Input label="s" bind:value={$config.layers[$current].s} />
    <Input label="r" bind:value={$config.layers[$current].r} min={0} max={360} />
</div>

<div flex="20 ai-c" class="mt-20">
    <input type="color" bind:value={$config.layers[$current].c} />
    <div flex="start center 10">
        <span text="16 mono">weight</span>
        <select on:change={(e) => ($config.layers[$current].w = e.target.value)}>
            {#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as item}
                <option value="{item}00">{item}00</option>
            {/each}
        </select>
    </div>
</div>

<PanelOrigin />
