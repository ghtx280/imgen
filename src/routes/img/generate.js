import { img } from "./create/img.js";
import { txt } from "./create/txt.js";
import { hex } from "./helpers.js";

export async function generateImage(ctx, config) {
    if (config.fill) {
        ctx.fillStyle = hex(config.fill);
        ctx.fillRect(0, 0, config.width, config.height);
    }

    const create = { config, ctx, txt, img };

    for (const cfg of config.layers) {
        try {
            await create[cfg.type]?.(cfg);
        } catch (err) {
            console.log(err);
        }
    }

    // const imageData = ctx.canvas.toBuffer('image/png');

    return ctx.canvas;
}