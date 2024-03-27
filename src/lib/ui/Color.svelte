<script>
    import { hex } from '$lib/helpers';

    export let value;
</script>

<div flex="10 ai-c">
    <input type="color" bind:value />
    <p>
        {hex(value || '')}
    </p>
</div>

<style>
    input[type='color'] {
        width: 30px;
        height: 30px;
        border: 0;
        padding: 0;
        margin: 0;
    }
</style>
