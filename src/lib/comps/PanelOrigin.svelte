<script>
    import { config, current } from '$lib/store.js';
</script>

<div flex="5 col" class="mt-20">
    <span>origin</span>

    <div grid="cols-3 ji-c ai-c" class="sq-70 b-1 r-5">
        {#each ['t', 'm', 'b'] as y}
            {#each ['s', 'c', 'e'] as x}
                <button
                    value={x + y}
                    class="h:scale-1.5 h:bg-$blue sq-60% bg-gray time-100 r-99 {$config.layers[$current].o == x + y
                        ? 'bg-$blue'
                        : ''}"
                    on:click={(e) => ($config.layers[$current].o = x + y)}>
                </button>
            {/each}
        {/each}
    </div>
</div>
