<script>
    import { config, current } from "$lib/store.js";

    export let index, item
</script>

<div class=" r-5 b-1 over-hidden" flex="space">
    <button 
        class="p-10 w-full" 
        text="left dots"
        on:click={ev => {            
            $current = index;
            location.hash = "#panel"
        }}
    >
        {index} {item.type}:  {item.data?.$name || item.data}
    </button>

    <button 
        class="p-10 bg-$red c-f"
        on:click={ev => {
            $config.layers = $config.layers.filter((e,i) => i != index)
            $current = null
            // config = config
        }}
    >
        X
    </button>
</div>