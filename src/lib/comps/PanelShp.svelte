<script>
    import { config, current } from '$lib/store.js';

    import Input from '$lib/ui/Input.svelte';
    import Move from '$lib/ui/Move.svelte';
    import Scale from '$lib/ui/Scale.svelte';
    import Origin from '$lib/ui/Origin.svelte';
    import Color from '$lib/ui/Color.svelte';
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
    <Input label="⟳" bind:value={$config.layers[$current].r} min={0} max={360} />
    <Input label="r" bind:value={$config.layers[$current].rd} min={0} />
</div>

<hr />

<div class="">
    <span>Fill</span>
    <div flex="10 ai-c" class="mt-10">
        <Color bind:value={$config.layers[$current].c} />
    </div>
</div>

<hr />

<div class="">
    <span>Stroke</span>
    <div flex="10 ai-c" class="mt-10">
        <Input label="w" bind:value={$config.layers[$current].bw} min={0} />
        <Color bind:value={$config.layers[$current].bc} />
    </div>
</div>

<hr />

<Origin />
