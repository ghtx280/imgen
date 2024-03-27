<script>
    import icon from '$lib/icon.js';
    import { config, current } from '$lib/store.js';

    export let index, item;
</script>

<div class="r-5 b-1 over-hidden" flex="space">
    <button
        class="p-10 w-full h-full"
        text="left dots mono"
        on:click={(ev) => {
            $current = index;
        }}>
        <strong>{index}.</strong>
        {item.type}: {item.data?.$name || item.data}
    </button>

    <button
        class="p-10 bg-$red c-f"
        on:click={(ev) => {
            $config.layers = $config.layers.filter((e, i) => i != index);
            $current = null;
            // config = config
        }}>
        {@html icon.trash2(16)}
    </button>
</div>
