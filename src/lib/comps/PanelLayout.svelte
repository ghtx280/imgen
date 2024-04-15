<script>
    import { config, current } from '$lib/store';
    import PanelImg from './PanelImg.svelte';
    import PanelShp from './PanelShp.svelte';
    import PanelTxt from './PanelTxt.svelte';

    $: data = $config.layers[$current];

    export let saveUrl;

    saveUrl();
</script>

{#if data?.type == 'txt'}
    <PanelTxt />
{/if}

{#if data?.type == 'img'}
    <PanelImg />
{/if}

{#if data?.type == 'shp'}
    <PanelShp />
{/if}
