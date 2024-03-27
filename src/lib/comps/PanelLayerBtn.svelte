<script>
    import icon from '$lib/icon.js';
    import { config, current } from '$lib/store.js';
    import { flip } from 'svelte/animate';
    import { fade, fly } from 'svelte/transition';

    export let index, item;

    const moveArr = (arr, from, to) => {
        [arr[from], arr[to]] = [arr[to], arr[from]];
        return arr;
    };

    let btn;

    function moveLayer(dir) {
        return (e) => {
            const i = +index;

            btn.style.order = '2';

            // setTimeout(() => {
            if (dir == 'up' && i > 0) {
                moveArr($config.layers, i, i - 1);
            }

            if (dir == 'down' && i + 1 in $config.layers) {
                moveArr($config.layers, i, i + 1);
            }
            $config.layers = $config.layers;
            // }, 300);
        };
    }
</script>

<div class="r-5 b-1 over-hidden bg-#333 time-300" flex="space" bind:this={btn}>
    <div class="w-fit" flex="col">
        <button class="px-5 h:bg-#222" on:click={moveLayer('up')}>
            {@html icon.chevronUp(16)}
        </button>

        <button class="px-5 h:bg-#222" on:click={moveLayer('down')}>
            {@html icon.chevronDown(16)}
        </button>
    </div>

    <button
        class="p-10 w-full h-full b-0 grow"
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
