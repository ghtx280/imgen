<script lang="ts">
    export let 
        value: string | undefined | number = "", 
        oninput: (...e: any) => any,
        label: string = "";

    $: oninput(value)

    function slide(node: HTMLSpanElement) {
        let pressed = false

        addEventListener("mousemove", (e) => {
            if (pressed && value !== undefined) {
                value = +value + Math.round(e.movementX / 2)
            }
        })

        node.addEventListener("mousedown", () => pressed = true)
        addEventListener("mouseup", () => pressed = false)
    }

</script>

<div flex="5 ai-c">
    {#if label}
        <span 
            use:slide 
            class="cursor-ew-resize select-none"
            text="500 up"
        >{label}</span>
    {/if}
    <input class="w-100" type="number" bind:value on:input={() => console.log(55)}>
</div>