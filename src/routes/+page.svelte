<script lang="ts">
    import { browser } from "$app/environment";
    import Input from "$lib/comps/Input.svelte";
    import TextArea from "$lib/comps/TextArea.svelte";

    // @ts-ignore
    import { generateImage } from "./img/generate";

    const config = {
        width: 400,
        height: 400,
        fill: '0xf0f',
        layers: [
            {
                type: 'txt',
                data: "lorem",
                x: 200,
                y: 200,
                c: 'red',
                s: 50,
                o: "cm"
            }
        ],
    }

    let imageSrc: any = ""
    let ctx: CanvasRenderingContext2D | undefined | null
    let canvas: HTMLCanvasElement | undefined | null

    $: if (canvas && browser) initCanvas()

    function initCanvas() {
        ctx = ctx || canvas?.getContext("2d")

        if (canvas && ctx) {
            ctx.canvas.width  = config.width
            ctx.canvas.height = config.height

            ctx?.clearRect(0, 0, config.width, config.height)

            generateImage(ctx, config).then(e => {
                imageSrc = ctx?.canvas.toDataURL("image/png")
            })
        }
        
        
        if (typeof window !== "undefined") {
            // @ts-ignore
            window.loadImage = async function(url: string) {
                return new Promise((res) => {
                    const img = new Image();
                    img.onload = () => {
                        res(img);
                    }
                    img.src = url;
                })
            }
        }
        
        
    }

    


    function changeColor(e: any) {
        config.fill = e.target.value
        initCanvas()
        
    }

    function changeSize(type: string) {
        return function(event: Event) {
            // @ts-ignore
            config[type] = event.target.value
            initCanvas()
        }
    }

    function changePos(direction: string) {
        return function(value: string) {
            // @ts-ignore
            config.layers[0][direction] = +value
            initCanvas()
        }
    }

    function changeText(value: string) {
        config.layers[0].data = value
        initCanvas()
    }

    $: changeText(config.layers[0].data)

    let isPanelTextHidden = false
</script>

<div class="h-screen flex">
    <div id="panel" class="w-full">

        <!-- <img src={imageSrc} alt="" width={config.width} height={config.height} > -->
        
        <canvas bind:this={canvas} width={config.width} height={config.height} ></canvas>

    </div>
    <div id="panel" class="bl-1 w-400 shrink-0 p-30">

        <input type="color" on:input={changeColor}>

        <div flex="5 ai-c">
            <span>w</span>
            <input type="number" value={config.width} on:input={changeSize("width")}>
        </div>

        <div flex="5 ai-c">
            <span>h</span>
            <input type="number" value={config.height} on:input={changeSize("height")}>
        </div>
    </div>

    <div 
        id="panel-text"  
        class="bl-1 w-400 shrink-0 p-30 bg-white fixed right-0 h-full"
        style:display={isPanelTextHidden ? "none" : ""}
    >

        <button 
            class="p-8+15 r-5 bg-tp b-1 mb-20"
            on:click={e => isPanelTextHidden = true}
        >{"<- Back"}</button>

        <TextArea bind:value={config.layers[0].data} />

        <div flex="10">    
            <Input label="x" bind:value={config.layers[0].x} oninput={changePos("x")} />
            <Input label="y" bind:value={config.layers[0].y} oninput={changePos("y")} />
        </div>

        <div flex="10">    
            <Input label="s" bind:value={config.layers[0].s} oninput={changePos("s")} />
            <Input label="r" bind:value={config.layers[0].r} oninput={changePos("r")} />
        </div>

        <div flex="10">    
            <div>
                <span>weight</span>
                <select on:change={e => config.layers[0].w = e.target.value}>
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="300">300</option>
                    <option value="400">400</option>
                    <option value="500">500</option>
                    <option value="600">600</option>
                    <option value="700">700</option>
                    <option value="800">800</option>
                    <option value="900">900</option>
                </select>
            </div>
            
            <input type="text" bind:value={config.layers[0].f} on:input={initCanvas}>
            <!-- <Input label="r" bind:value={config.layers[0].r} oninput={changePos("r")} /> -->
        </div>

        <div flex="5 col" class="mt-20">   
            <span>orgin</span> 

            <div grid="cols-3 ji-c ai-c" class="sq-70 b-1 r-5"> 
                {#each [
                    "st", "ct", "et", 
                    "sm", "cm", "em",
                    "sb", "cb", "eb",
                ] as value}
                    <button 
                        {value} 
                        class="h:scale-1.5 h:bg-$blue sq-60% bg-gray time-100 r-99"
                        on:click={e => config.layers[0].o = value}
                    >
                    </button>
                {/each}
            </div>
        </div>
    </div>
</div>

