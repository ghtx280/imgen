<script>
    import { config, current } from "$lib/store.js";

    function scaling(node) {
    let pressed = false;

    function scale(value, movement) {
        return +value + (movement / 2)
    }

    node.addEventListener("mousedown", () => pressed = true );

    addEventListener("mouseup", () => pressed = false);

    addEventListener("mousemove", (event) => {
        if (pressed) {
            $config.layers[$current].w = scale($config.layers[$current].w, event.movementX);
            $config.layers[$current].h = scale($config.layers[$current].h, event.movementX);
        }
    })
}
</script>


<button class="rel sq-30 r-5 b-1" flex="center" use:scaling>
    <span text="34" class="abs translate-3+-2 rotate-45">↕</span>
</button>