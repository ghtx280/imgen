<script lang="ts">
    import type { Canvas, Ctx } from '$lib/types';

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

    let ctx: Ctx | undefined | null;
    let canvas: Canvas | undefined | null;

    let linkData: string = '';

    function encode(str: string) {
        return str.replace(/&/g, '%26').replace(/\?/g, '%3F');
    }

    function createLinkData(c: any) {
        return `s=${c.width}x${c.height}&fill=${hex0x(c.fill)}&l=${c.layers
            .map((e: any) => {
                return (
                    e.type +
                    ':' +
                    encode(e.data?.$name || e.data) +
                    ';' +
                    Object.entries(e)
                        .map(([k, v]) => {
                            if (k !== 'data' && k !== 'type' && !k.startsWith('$')) {
                                return `${k}:${['c', 'bc'].includes(k) ? hex0x(v as string) : v}`;
                            }
                        })
                        .filter(Boolean)
                        .join(',')
                );
            })
            .join('|')}`;
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
            const layer = $config.layers[$current];
            layer.x = speed(layer.x, ev.movementX * 2, ev);
            layer.y = speed(layer.y, ev.movementY * 2, ev);
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

    onMount(() => {
        local = $page.url.search;

        try {
            // @ts-ignore
            $config = local ? parseConfig(local) : $config;
        } catch (error) {}

        addEventListener('keydown', (ev) => {
            ev.preventDefault();
            if (ev.ctrlKey && ev.key == 'c') copyLink();
        });
    });
</script>

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
        <canvas bind:this={canvas} class="m-50" style:transform={`scale(${canvasScale}) translate(${xxx}px, ${yyy}px)`}>
        </canvas>
        <!-- </div> -->

        <!-- <p class="p-30 select-all w-60% over-hidden text-wrap fixed bottom-0 left-0">
            https://imgenx.vercel.app/img{linkData}
        </p> -->

        <div class="abs bottom-0 right-0 p-20 c-red">
            <button class="btn" on:click={() => (canvasScale += 0.05)}>{@html icon.zoomIn(15)}</button>
            <button class="btn" on:click={() => (canvasScale -= 0.05)}>{@html icon.zoomOut(15)}</button>
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
