<script lang="ts">
    import { generateImage } from "./img/generate";
    import { browser       } from "$app/environment";
    import { config, current        } from "$lib/store";
    
    import Input       from "$lib/comps/Input.svelte";
    import PanelLayout from "$lib/comps/PanelLayout.svelte";
    import PanelMain   from "$lib/comps/PanelMain.svelte";
    import TextArea    from "$lib/comps/TextArea.svelte";
    import { hex0x } from "./img/helpers";
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import parseConfig from "./img/parseConfig";
    import { goto } from "$app/navigation";

    // @ts-ignore


    let imageSrc: any = ""
    let ctx: CanvasRenderingContext2D | undefined | null
    let canvas: HTMLCanvasElement | undefined | null

    let linkData: string = ""


    function createLinkData(c: any) {
                
    
        
        return `s=${c.width}x${c.height}&fill=${hex0x(c.fill)}&l=${
            c.layers.map((e: any) => {
                return e.type + ":" + (e.data?.$name || e.data) + ";" + 
                Object.entries(e).map(([k, v]) => {
                    if (k !== "data" && k !== "type") {
                        return `${k}:${
                            k == "c" ? hex0x(v) : v
                        }`
                    }
                }).filter(Boolean).join(",")
                
            }).join("|")
        }`
    }

    let local: any = null

    onMount(() => {
        local = $page.url.search

        try {
            // @ts-ignore
            $config = local ? parseConfig(local) : $config 
        } catch (error) {
            
        }

    })

    $: if (canvas && browser) render( $config )

    function render(cfg: any) {
        ctx = ctx || canvas?.getContext("2d")

        if (canvas && ctx) {            
            ctx.canvas.width  = +cfg.width  || 100
            ctx.canvas.height = +cfg.height || 100

            ctx?.clearRect(0, 0, cfg.width, cfg.height)

            generateImage(ctx, cfg).then(e => {
                
                // imageSrc = ctx?.canvas.toDataURL("image/png", 75)
                // console.log(imageSrc);
                
            })

            linkData = createLinkData(cfg).replace(/\s/g, "%20")

            goto(`?${linkData}`)
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

</script>

<div class="h-screen flex">
    <div id="panel" class="w-full" flex="col jc-sb ai-s">

        <!-- <img src={imageSrc} alt="" width={$config.width} height={$config.height} style="display: none;"> -->
        
        <canvas bind:this={canvas} ></canvas>


        <p class="p-30 select-all w-60% over-hidden text-wrap fixed bottom-0">
            https://imgenx.vercel.app/img?{linkData}
        </p>

    </div>



    <PanelMain />
    
    {#if $config.layers.length && $current !== null}
       <PanelLayout />
    {/if}
</div>

