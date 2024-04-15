<script lang="ts">
    import type { DragCallback } from '$lib/helpers';
    import { drag } from '$lib/helpers';

    export let value: string | undefined | number = '',
        label: string = '',
        def: string = '0',
        min: number | null = null,
        max: number | null = null;

    value ||= def;

    const slide: DragCallback = (event, speed) => {
        if (value !== undefined) {
            value = speed(value, event.movementX, event);
            if (min !== null && value < min) {
                value = min;
            }

            if (max !== null && value > max) {
                value = max;
            }
        } else {
            value = 0;
        }
    };
</script>

<div flex="5 ai-c" class="b-1 bc-gray h-35">
    {#if label}
        <span use:drag={slide} class="cursor-ew-resize select-none min-w-16 p-10 w-30" text="500 up mono 16 bold">
            {label}
        </span>
    {/if}
    <input
        class="w-60"
        type="number"
        bind:value
        on:click={(e) => {
            // @ts-ignore
            e.target?.select();
        }} />
</div>

<style>
    input {
        background: none;
        border: 0;
    }
</style>
