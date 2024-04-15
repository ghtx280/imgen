<script>
    import { drag } from '$lib/helpers';
    import icon from '$lib/icon.js';
    import { config, current } from '$lib/store';

    function handleMove(event, speed) {
        $config.layers[$current].x = speed($config.layers[$current].x, event.movementX, event);
        $config.layers[$current].y = speed($config.layers[$current].y, event.movementY, event);
    }
</script>

<button class="rel sq-35 b-1" flex="center" use:drag={handleMove}>
    {@html icon.move(21, '#eee', 1.5)}
</button>
