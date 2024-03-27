import type { Config, Ctx } from '$lib/types.js';
import img from './create/img';
import txt from './create/txt';
import shp from './create/shp';
import { hex } from './helpers.js';

export async function generateImage(ctx: Ctx, config: Config) {
    if (config.fill) {
        ctx.fillStyle = hex(config.fill);
        ctx.fillRect(0, 0, config.width, config.height);
    }

    const create = { config, ctx, txt, img, shp };

    for (const cfg of config.layers) {
        try {
            await create[cfg.type](cfg)
        } catch (err) {
            console.log(err);
        }
    }

    return ctx.canvas;
}
