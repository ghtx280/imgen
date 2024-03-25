<script>
    import { config, current } from "$lib/store.js";

    function scaling(node) {
        let pressed = false;
        

        function scale(value, movement, ratio) {
            return +value + Math.round((movement / 2) * ratio)
        }

        // 500 + 500 / (500 / 250) = 1000

        // 250 + 500 / (500 / 250) = 750

        node.addEventListener("mousedown", () => pressed = true );

        addEventListener("mouseup", () => pressed = false);

        addEventListener("mousemove", (event) => {
            if (pressed) {
                let obj = $config.layers[$current]
                let ratio = obj.w / obj.h;

                $config.layers[$current].w = scale(obj.w, event.movementY, 1);
                $config.layers[$current].h = scale(obj.h, event.movementY, 1);
            }
        })
    }
</script>


<button class="rel sq-30 r-5 b-1" flex="center" use:scaling>
    <span text="34" class="abs translate-3+-2 rotate-45">↕</span>
</button>