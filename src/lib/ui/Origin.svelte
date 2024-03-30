<script>
    import { config, current } from '$lib/store.js';

    function processOrigin(x, y) {
        return () => {
            const cur = $config.layers[$current];
            const [ox, oy] = cur.o || 'st';

            if (x == ox) return;

            if (ox == 's' && x == 'c') {
                cur.x = cur.x + cur.w / 2;
            }
            if (ox == 's' && x == 'e') {
                cur.x = cur.x + cur.w;
            }
            if (ox == 'c' && x == 's') {
                cur.x = cur.x - cur.w / 2;
            }
            if (ox == 'c' && x == 'e') {
                cur.x = cur.x + cur.w / 2;
            }
            if (ox == 'e' && x == 's') {
                cur.x = cur.x - cur.w;
            }
            if (ox == 'e' && x == 'c') {
                cur.x = cur.x - cur.w / 2;
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
