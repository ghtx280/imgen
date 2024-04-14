<script lang="ts">
    import { hex } from '$lib/helpers';

    export let value: string,
        showHex = true;

    let id = Math.floor(Math.random() * 1000);
</script>

<div flex="10 ai-c">
    <label for="clr-{id}" class="b-1 sq-35" style:background={value}></label>
    <input id="clr-{id}" type="text" bind:value data-coloris class="op-0! ml--45!" />
    {#if showHex}
        <p>
            {hex(value || '')}
        </p>
    {/if}
</div>

<style>
    input {
        width: 0 !important;
        height: 0 !important;
        border: 0;
        padding: 0;
        /* margin: 0; */
    }
</style>
