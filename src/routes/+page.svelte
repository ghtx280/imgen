<script lang="ts">
    import type { Canvas, Ctx } from '$lib/types';

    import { generateImage } from '$lib/generate';
    import { browser, dev } from '$app/environment';
    import { config, current } from '$lib/store';
    import { hex0x } from '$lib/helpers';

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

    function createLinkData(c: any) {
        return `s=${c.width}x${c.height}&fill=${hex0x(c.fill)}&l=${c.layers
            .map((e: any) => {
                return (
                    e.type +
                    ':' +
                    (e.data?.$name || e.data) +
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

    onMount(() => {
        local = $page.url.search;

        try {
            // @ts-ignore
            $config = local ? parseConfig(local) : $config;
        } catch (error) {}
    });

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
</script>

<Tip />

<div class="h-screen flex bg-#111 *:c-#eee">
    <div id="сanvas_panel" class="w-full" flex="col center">
        <canvas bind:this={canvas}></canvas>

        <p class="p-30 select-all w-60% over-hidden text-wrap fixed bottom-0 left-0">
            https://imgenx.vercel.app/img{linkData}
        </p>
    </div>

    <div class="h-full w-10 cursor-ew-resize" use:resizer={600}></div>

    <div id="tools_panel" class="bl-1 shrink-0 p-30" style="width: 600px;">
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

            <button class="btn bg-$green-3 p-5+15 b-0 {!saved ? 'outline-2+solid+$red' : ''}" on:click={saveUrl}>
                Save
            </button>
        </div>

        <hr />

        {#if $config.layers.length && $current !== null}
            <PanelLayout {saveUrl} />
        {:else}
            <PanelMain {saveUrl} />
        {/if}
    </div>
</div>
