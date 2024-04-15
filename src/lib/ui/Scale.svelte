<script>
    import { drag } from '$lib/helpers';
    import icon from '$lib/icon.js';
    import { config, current } from '$lib/store';

    function scaling(event, speed) {
        let obj = $config.layers[$current];
        // let ratio = obj.w / obj.h;
        let ow = obj.w;
        let oh = obj.h;

        $config.layers[$current].w = Math.round(speed(obj.w, event.movementY, event));
        $config.layers[$current].h = ($config.layers[$current].w * oh) / ow;

        $config.layers[$current].w = $config.layers[$current].w?.toFixed?.(1);
        $config.layers[$current].h = $config.layers[$current].h?.toFixed?.(1);
    }
</script>

<button class="rel sq-35 b-1" flex="center" use:drag={scaling}>
    {@html icon.maximize2(21, '#eee', 1.5)}
</button>
