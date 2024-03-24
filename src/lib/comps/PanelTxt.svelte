<script>
    import { config, current } from "$lib/store.js";
    import { hex } from "../../routes/img/helpers.js";
    import Input from "./Input.svelte";
    import TextArea from "./TextArea.svelte";

    // export let current = 0
    
    // $: console.log(current);

    // let data = $config.layers[$current] || {}


    // $: $config.layers[$current] = data
    // // let data, x, y, s, r, w, o

    // console.log($config.layers[$current]);

    $: $config.layers[$current] ||= {}
</script>

<TextArea bind:value={$config.layers[$current].data} />

<div flex="10">
    <Input label="x" bind:value={$config.layers[$current].x} />
    <Input label="y" bind:value={$config.layers[$current].y} />
</div>

<div flex="10">
    <Input label="s" bind:value={$config.layers[$current].s} />
    <Input label="r" bind:value={$config.layers[$current].r} />
</div>



<div flex="20 ai-c">
    <input type="color" bind:value={$config.layers[$current].c}>
    <div>
        <span>weight</span>
        <select on:change={(e) => ($config.layers[$current].w = e.target.value)}>
            {#each [1,2,3,4,5,6,7,8,9] as item}
                <option value="{item}00">{item}00</option>
            {/each}
        </select>
    </div>
</div>

<div flex="5 col" class="mt-20">
    <span>orgin</span>

    <div grid="cols-3 ji-c ai-c" class="sq-70 b-1 r-5">
        {#each ['t', 'm', 'b'] as y}
            {#each ['s', 'c', 'e'] as x}
                <button
                    value={x + y}
                    class="h:scale-1.5 h:bg-$blue sq-60% bg-gray time-100 r-99"
                    on:click={(e) => ($config.layers[$current].o = x + y)}
                >
                </button>
            {/each}
        {/each}
        
    </div>
</div>
