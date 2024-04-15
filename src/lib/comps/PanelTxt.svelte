<script>
    import { page } from '$app/stores';
    import { config, current } from '$lib/store';
    import Color from '$lib/ui/Color.svelte';
    import Input from '$lib/ui/Input.svelte';
    import Move from '$lib/ui/Move.svelte';
    import Origin from '$lib/ui/Origin.svelte';
    import Select from '$lib/ui/Select.svelte';
    import TextArea from '$lib/ui/TextArea.svelte';

    $: $config.layers[$current] ||= {};

    const fontNames = $page.data.fontNames;
</script>

<div flex="10 ai-c" class="mt-20">
    <Input label="x" bind:value={$config.layers[$current].x} />
    <Input label="y" bind:value={$config.layers[$current].y} />

    <Move />
</div>

<div flex="10 ai-c" class="mt-10">
    <Input label="s" bind:value={$config.layers[$current].s} min={0} />
    <Input label="r" bind:value={$config.layers[$current].r} min={-360} max={360} />
</div>

<div flex="10 ai-c" class="mt-10">
    <Input label="lh" bind:value={$config.layers[$current].lh} min={1} max={500} />
    <Input label="mw" bind:value={$config.layers[$current].mw} min={0} max={9999} />
</div>
<hr />

<div class="">
    <span>Text</span>
    <div class="mt-10">
        <TextArea bind:value={$config.layers[$current].data} />
    </div>
</div>

<hr />

<div class="">
    <span>Font</span>
    <div class="my-10" flex="10">
        <Select
            width="250"
            options={fontNames.map((e) => ({ value: e, class: 'ff-' + e.replace(/\s/g, '_') }))}
            selected={0}
            bind:value={$config.layers[$current].f} />
        <Select
            options={[1, 2, 3, 4, 5, 6, 7, 8, 9].map((e) => e + '00')}
            selected={0}
            bind:value={$config.layers[$current].w} />
    </div>
</div>

<hr />

<div flex="10 col" class="mt-20">
    <span>Color</span>
    <Color bind:value={$config.layers[$current].c} />
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

<Origin ignore={true} />
