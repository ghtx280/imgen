<script>
    import { config, current } from '$lib/store';

    export let ignore;

    function processOrigin(x, y) {
        return () => {
            const cur = $config.layers[$current];
            const [ox, oy] = cur.o || 'st';

            // console.log(cur.x);

            const setDirOrigin = (d, o, n) => {
                let s = n == 'x' ? cur.w : cur.h;
                let p = n == 'x' ? 'sce' : 'tmb';

                if (!ignore && d !== o) {
                    if (o == p[0]) cur[n] += d == p[1] ? s / 2 : s;
                    if (o == p[1]) cur[n] += d == p[0] ? -(s / 2) : s / 2;
                    if (o == p[2]) cur[n] += d == p[1] ? -(s / 2) : -s;
                }
            };

            setDirOrigin(x, ox, 'x');
            setDirOrigin(y, oy, 'y');

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
