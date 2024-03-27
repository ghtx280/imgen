<script>
    import { config, current } from '$lib/store';
    import Input from '$lib/ui/Input.svelte';
    import Move from '$lib/ui/Move.svelte';
    import Origin from '$lib/ui/Origin.svelte';
    import TextArea from '$lib/ui/TextArea.svelte';

    $: $config.layers[$current] ||= {};
</script>

<div flex="10 ai-c" class="mt-20">
    <Input label="x" bind:value={$config.layers[$current].x} />
    <Input label="y" bind:value={$config.layers[$current].y} />

    <Move />
</div>

<div flex="10 ai-c" class="mt-10">
    <Input label="s" bind:value={$config.layers[$current].s} />
    <Input label="r" bind:value={$config.layers[$current].r} min={0} max={360} />
</div>

<hr />

<div class="">
    <span>Text</span>
    <div class="mt-10">
        <TextArea bind:value={$config.layers[$current].data} />
    </div>
</div>

<hr />

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

<Origin />
