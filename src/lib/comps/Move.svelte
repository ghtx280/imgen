<script>
    import { config, current } from "$lib/store.js";

    function moving(node) {
    let pressed = false;

    function move(value, movement) {
        return +value + (movement / 2)
    }

    node.addEventListener("mousedown", () => pressed = true );

    addEventListener("mouseup", () => pressed = false);

    addEventListener("mousemove", (event) => {
        if (pressed) {
            $config.layers[$current].x = move($config.layers[$current].x, event.movementX);
            $config.layers[$current].y = move($config.layers[$current].y, event.movementY);
        }
    })
}
</script>


<button class="rel sq-30 r-5 b-1" flex="center" use:moving>
    <span text="34" class="abs translate-0+-3">↕</span>
    <span text="34" class="abs translate-0+-6">↔</span>
</button>