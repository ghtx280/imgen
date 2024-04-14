<script lang="ts">
    import { fade } from 'svelte/transition';
    import type { Canvas, Ctx, LayerBase, LayerKeys } from '$lib/types';

    import { generateImage } from '$lib/generate';
    import { browser, dev } from '$app/environment';
    import { config, current } from '$lib/store';
    import { drag, hex0x, type DragCallback } from '$lib/helpers';

    import parseConfig from '../lib/parseConfig';
    import icon from '$lib/icon';

    import PanelLayout from '$lib/comps/PanelLayout.svelte';
    import PanelMain from '$lib/comps/PanelMain.svelte';
    import TextArea from '$lib/ui/TextArea.svelte';

    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { stringifyLayer } from '$lib/stringifyLayer';
    import Tip from '$lib/ui/Tip.svelte';
    import type { PageData } from './$types';

    let ctx: Ctx | undefined | null;
    let canvas: Canvas | undefined | null;

    let linkData: string = '';

    function encode(str: string) {
        return str.replace(/&/g, '%26').replace(/\?/g, '%3F');
    }

    function createLinkData(c: any) {
        // c:45!0x000000~0xff0000

        const ignore_base = {
            x: '0',
            y: '0',
            c: ['0x000000', '#000000'],
            r: ['-360', '0', '360'],
            o: 'st',
            bw: '0',
            bc: ['0x000000', '#000000']
        };

        const ignore_rect_like = {
            w: [c.width + '', '0'],
            h: [c.height + '', '0'],
            rd: '0',
            rdbr: '0',
            rdbl: '0',
            rdtr: '0',
            rdtl: '0'
        };

        const ignore = {
            shp: { ...ignore_base, ...ignore_rect_like },
            img: { ...ignore_base, ...ignore_rect_like },
            txt: {
                ...ignore_base,
                s: ['0', '16'],
                f: 'Inter'
            }
        } as const;

        return `s=${c.width}x${c.height}&fill=${hex0x(c.fill)}&l=${c.layers
            .map((e: any) => {
                let type = e.type as LayerBase['type'];
                return (
                    type +
                    ':' +
                    encode(e.data?.$name || e.data) +
                    ';' +
                    Object.entries(e)
                        .map((q) => {
                            const k = q[0] as LayerKeys;
                            const v = q[1] as string | number;

                            const ignoreType = ignore[type] as {
                                [key in LayerKeys]: string | string[];
                            };
                            const ign = ignoreType[k];

                            // дописати іф ігнор ну таке крч

                            if (typeof ign == 'object' && ign.includes(v + '')) return null;

                            if ((typeof ign == 'number' || typeof ign == 'string') && ign == v + '') return null;

                            if (k == 'bc' && !ignore_base.bc.includes(v + '') && e.bw == 0) {
                                return null;
                            }

                            if (!['data', 'type'].includes(k) && k[0] !== '$') {
                                return `${k}:${['c', 'bc'].includes(k) ? hex0x(v as string) : v}`;
                            }
                        })
                        .filter(Boolean)
                        .join(',')
                );
            })
            .join('|')}`;

        let a = [1, 'fd'];
    }

    let local: any = null;

    function setLoadImage() {
        if (typeof window !== 'undefined') {
            // @ts-ignore
            window.loadImage = async function (url: string) {
                return new Promise((res) => {
                    const img = new Image();
                    img.onload = () => {
                        res(img);
                    };
                    // img.crossOrigin="anonymous"
                    img.src = url;
                });
            };
        }
    }

    $: if (canvas && browser) setLoadImage();

    $: if (canvas && browser) render($config);

    let saved = true;

    function saveUrl() {
        goto(linkData);
        saved = true;
    }

    async function render(cfg: any) {
        // console.log('render');

        ctx = ctx || canvas?.getContext('2d');

        if (canvas && ctx) {
            ctx.canvas.width = +cfg.width || 100;
            ctx.canvas.height = +cfg.height || 100;

            ctx?.clearRect(0, 0, cfg.width, cfg.height);

            await generateImage(ctx, cfg);

            linkData = '?' + createLinkData(cfg).replace(/\s/g, '%20');

            saved = location.search == linkData;
        }

        addEventListener('beforeunload', (event) => {
            if (!saved) {
                event.preventDefault();
                event.returnValue = true;
            }
        });
    }

    function resizer(node: HTMLDivElement, width: number) {
        let pressed = false;

        let panel = document.querySelector('#tools_panel') as HTMLDivElement;

        addEventListener('mouseup', () => {
            pressed = false;
            document.body.style.userSelect = '';
        });
        node.addEventListener('mousedown', () => {
            pressed = true;
            document.body.style.userSelect = 'none';
        });

        addEventListener('mousemove', (e) => {
            if (pressed) {
                width = width - e.movementX;
                panel.style.width = `${width}px`;
            }
        });
    }

    function copyLayer() {
        if ($current == null) return;

        navigator.clipboard.writeText(stringifyLayer($config.layers[$current]));
        alert('Layer copied!');
    }

    let canvasScale = 1;
    let xxx = 0;
    let yyy = 0;

    const moveCanvas: DragCallback = (ev, speed) => {
        if ($current == null) {
            xxx += (ev?.movementX || 0) / canvasScale;
            yyy += (ev?.movementY || 0) / canvasScale;
        } else {
            const layer = $config.layers[$current] as { x: number; y: number };
            layer.x = speed(layer.x, (ev.movementX * 2) / canvasScale, ev);
            layer.y = speed(layer.y, (ev.movementY * 2) / canvasScale, ev);
            $config = $config;
        }
    };

    let showLink = false;

    $: fullLink = `${$page.url.origin}/img${linkData}`;

    function copyLink() {
        try {
            navigator.clipboard.writeText(fullLink);
            alert('Link copied!');
            showLink = false;
        } catch (error) {
            alert(error);
        }
    }

    let loaded = false;

    onMount(() => {
        local = $page.url.search;

        try {
            // @ts-ignore
            $config = local ? parseConfig(local) : $config;
        } catch (error) {}

        // addEventListener('keydown', (ev) => {
        //     if (ev.ctrlKey && ev.key == 'c') {
        //         ev.preventDefault();
        //         copyLink();
        //     }
        // });

        loaded = true;
    });

    export let data: PageData;
</script>

{#if !loaded}
    <div class="fullscreen z-99999 bg-#111" flex="center" transition:fade>
        <img class="sq-100 anim-pulse" src="/favicon.svg" alt="IMGENX" />
    </div>
{/if}

<div class="preload_fonts flex abs select-none events-none z--999">
    {#each data.fontNames as item}
        <span style="font-family: {item}; color: transparent !important">{item}</span>
    {/each}
</div>

<Tip />

{#if showLink}
    <div class="fullscreen z-999 p-20" flex="center">
        <div flex="20 col" class="bg-f w-full lg:w-500 p-50">
            <p class="select-all w-full" text="wrap">{fullLink}</p>
            <button class="btn bg-0 c-f" on:click={copyLink}>Copy</button>
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="fullscreen bg-black/70 z--1" on:click={() => (showLink = false)}></div>
    </div>
{/if}

<div class="h-100dvh flex bg-#111 *:c-#eee" flex="m-lg:col">
    <div id="сanvas_panel" class="w-full rel h-50% lg:h-full over-hidden" flex="col center" use:drag={moveCanvas}>
        <!-- <div class="sq-full over-auto" flex="center"> -->
        <canvas
            bind:this={canvas}
            class="m-50 b-1 bc-f"
            style:transform={`scale(${canvasScale}) translate(${xxx}px, ${yyy}px)`}>
        </canvas>
        <!-- </div> -->

        <!-- <p class="p-30 select-all w-60% over-hidden text-wrap fixed bottom-0 left-0">
            https://imgenx.vercel.app/img{linkData}
        </p> -->

        <div class="abs bottom-0 right-0 p-20 c-red">
            <button class="btn" on:click={() => (canvasScale += 0.1)}>{@html icon.zoomIn(15)}</button>
            <button class="btn" on:click={() => (canvasScale -= 0.1)}>{@html icon.zoomOut(15)}</button>
        </div>
    </div>

    <div class="m-lg:hide h-full w-10 cursor-ew-resize" use:resizer={600}></div>

    <div
        id="tools_panel"
        class="lg:bl-1 m-lg:bt-1 lg:shrink-0 bg-#111 p-30 over-y-auto h-50% lg:h-full rel z-9 pb-200 m-lg:w-full!"
        style="width: 600px;">
        <div class="mb-20" flex="space">
            <div flex="10">
                <button
                    class="btn"
                    flex="10 ai-c"
                    class:invisible={$current == null}
                    on:click={() => ($current = null)}>
                    {@html icon.arrowLeft(20)} Back
                </button>

                <button class="btn" flex="10 ai-c center" class:invisible={$current == null} on:click={copyLayer}>
                    {@html icon.copy(17)}
                </button>
            </div>

            <div flex="20">
                <button class="btn bg-$green-3 p-5+15 b-0 {!saved ? 'outline-2+solid+$red' : ''}" on:click={saveUrl}>
                    Save
                </button>

                <!-- <a
                    href="https://imgenx.vercel.app/img{linkData}"
                    target="_blank"
                    class="btn bg-$green-3 p-5+15 b-0 {!saved ? 'outline-2+solid+$red' : ''}"
                    on:click={saveUrl}
                    text="align-bottom">
                    Open
                </a> -->

                <button class="btn *:c-black bg-f" flex="10 ai-c center" on:click={() => (showLink = true)}>
                    {@html icon.link(17, '', 2)}
                </button>
            </div>
        </div>

        <hr />

        {#if $config.layers.length && $current !== null}
            <PanelLayout {saveUrl} />
        {:else}
            <PanelMain {saveUrl} />
        {/if}
    </div>
</div>
