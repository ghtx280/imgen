<script lang="ts">
    export let value: string | undefined | number = '',
        label: string = '',
        def: string = '0',
        min: number | null = null,
        max: number | null = null;

    value ||= def;

    function slide(node: HTMLSpanElement) {
        let pressed = false;

        addEventListener('mousemove', (e) => {
            if (pressed && value !== undefined) {
                value = +value + Math.round(e.movementX / 2);
                if (min !== null && value < min) {
                    value = min;
                }

                if (max !== null && value > max) {
                    value = max;
                }
            }
        });

        node.addEventListener('mousedown', () => (pressed = true));
        addEventListener('mouseup', () => (pressed = false));
    }
</script>

<div flex="5 ai-c">
    {#if label}
        <span
            use:slide
            class="cursor-ew-resize select-none min-w-16"
            text="500 up mono 18"
        >
            {label}
        </span>
    {/if}
    <input
        class="w-100"
        type="number"
        bind:value
        on:click={(e) => {
            // @ts-ignore
            e.target?.select();
        }}
    />
</div>
