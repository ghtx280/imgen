<script>
    import { page } from '$app/stores';
    import { config, current } from '$lib/store.js';
    import PanelImg from './PanelImg.svelte';
    import PanelTxt from './PanelTxt.svelte';

    // export let current;

    // current ||= {}

    $: data = $config.layers[$current];

    // $: show = $page.url.hash == '#panel';
</script>

<!-- {#if show} -->
    <div class="panel-text bl-1 w-400 shrink-0 p-30 bg-white fixed right-0 h-full">
        <button
            class="p-8+15 r-5 bg-tp b-1 mb-20 block w-fit"
            on:click={() => {
                $current = null
            }}
        >
            {'< Back'}
        </button>

        {#if data?.type == 'txt'}
            <PanelTxt />
        {/if}

        {#if data?.type == 'img'}
            <PanelImg />
        {/if}
    </div>
<!-- {/if} -->
