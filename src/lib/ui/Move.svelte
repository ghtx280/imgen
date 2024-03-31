<script>
    import icon from '$lib/icon.js';
    import { config, current } from '$lib/store.js';

    function moving(node) {
        let pressed = false;

        function move(value, movement, ev) {
            return +value + Math.round(ev.shiftKey ? movement * 2 : ev.ctrlKey ? movement / 5 : movement / 2);
        }

        node.addEventListener('mousedown', () => (pressed = true));

        addEventListener('mouseup', () => (pressed = false));

        addEventListener('mousemove', (event) => {
            if (pressed) {
                $config.layers[$current].x = move($config.layers[$current].x, event.movementX, event);
                $config.layers[$current].y = move($config.layers[$current].y, event.movementY, event);
            }
        });
    }
</script>

<button class="rel sq-35 b-1" flex="center" use:moving>
    {@html icon.move(21, '#eee', 1.5)}
</button>
