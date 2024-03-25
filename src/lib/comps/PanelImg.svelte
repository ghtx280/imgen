<script>
    import { browser } from "$app/environment";
    import { config, current, images } from "$lib/store.js";
    import Input from "./Input.svelte";
    import Move from "./Move.svelte";
    import Scale from "./Scale.svelte";



    $: $config.layers[$current] ||= {}

    let img = $config.layers[$current].data
    let imgName = img
    let imgElem = null

    console.log(img);

    if (img.$name) {
        imgName = img.$name
        imgElem = img.$elem
    }


    async function setImg() {
        if (browser) {
            // if (imgName) {
                
            // }
            // $images[imgName] = 

            // console.log([$images[imgName]]);

            $config.layers[$current].data = {
                $name: imgName,
                $elem: await loadImage(imgName)
            }
        }
    }

    setImg()
</script>




<div flex="10 ai-c">
    <input type="text" class="px-20 h-40 r-5 b-1 w-full" bind:value={imgName}>
    <button class="px-20 h-40 r-5 b-1" on:click={setImg}>
        set
    </button>
</div>

<div flex="10 ai-c">
    <Input label="x" bind:value={$config.layers[$current].x} />
    <Input label="y" bind:value={$config.layers[$current].y} />

    <Move />
</div>

<div flex="10 ai-c">
    <Input label="w" bind:value={$config.layers[$current].w} />
    <Input label="h" bind:value={$config.layers[$current].h} />

    <Scale />
</div>

<div flex="10">
    <Input label="r"  bind:value={$config.layers[$current].r} />
    <Input label="rd" bind:value={$config.layers[$current].rd} />
</div>






