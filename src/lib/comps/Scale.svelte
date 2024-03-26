<script>
    import icon from '$lib/icon.js';
    import { config, current } from '$lib/store.js';

    function scaling(node) {
        let pressed = false;

        function scale(value, movement) {
            return +value + Math.round(movement / 2);
        }

        // 500 + 500 / (500 / 250) = 1000

        // 250 + 500 / (500 / 250) = 750

        node.addEventListener('mousedown', () => (pressed = true));

        addEventListener('mouseup', () => (pressed = false));

        addEventListener('mousemove', (event) => {
            if (pressed) {
                let obj = $config.layers[$current];
                let ratio = obj.w / obj.h;
                let ow = obj.w;
                let oh = obj.h;

                $config.layers[$current].w = Math.round(scale(obj.w, event.movementY));
                $config.layers[$current].h = ($config.layers[$current].w * oh) / ow;
            }
        });
    }
</script>

<button class="rel sq-30 r-5 b-1" flex="center" use:scaling>
    {@html icon.maximize2(20, '#eee', 1.5)}
</button>
