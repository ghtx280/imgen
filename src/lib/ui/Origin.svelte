<script>
    import { config, current } from '$lib/store.js';

    function processOrigin(x, y) {
        return () => {
            const cur = $config.layers[$current];
            const [ox, oy] = cur.o || 'st';

            if (x !== ox) {
                if (ox == 's') cur.x += x == 'c' ? cur.w / 2 : cur.w;
                if (ox == 'c') cur.x += x == 's' ? -(cur.w / 2) : cur.w / 2;
                if (ox == 'e') cur.x += x == 'c' ? -(cur.w / 2) : -cur.w;
            }

            if (y !== oy) {
                if (oy == 't') cur.y += y == 'm' ? cur.h / 2 : cur.h;
                if (oy == 'm') cur.y += y == 't' ? -(cur.h / 2) : cur.h / 2;
                if (oy == 'b') cur.y += y == 'm' ? -(cur.h / 2) : -cur.h;
            }

            cur.o = x + y;

            $config.layers[$current] = $config.layers[$current];
        };
    }
</script>

<div flex="5 col" class="mt-20">
    <span>Origin</span>

    <div grid="cols-3 ji-c ai-c" class="sq-70 b-1 mt-10">
        {#each ['t', 'm', 'b'] as y}
            {#each ['s', 'c', 'e'] as x}
                <button value={x + y} class="sq-full time-100" on:click={processOrigin(x, y)} flex="center">
                    <div class="r-5 bg-f {$config.layers[$current].o == x + y ? 'sq-60%' : 'sq-3'}"></div>
                </button>
            {/each}
        {/each}
    </div>
</div>

<style>
    button:hover div {
        width: 60%;
        height: 60%;
    }
</style>
