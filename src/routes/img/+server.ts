import { GlobalFonts, Path2D, createCanvas, loadImage } from '@napi-rs/canvas';
import { json, type RequestHandler } from '@sveltejs/kit';
import { generateImage } from '../../lib/generate.js';
import parseConfig from '../../lib/parseConfig.js';


function makeError(error: string) {
    return json({ error }, { status: 400 })
}

export const GET: RequestHandler = async (e) => {
    // @ts-ignore
    globalThis.Path2D = Path2D
    
    // @ts-ignore
    globalThis.loadImage = loadImage

    const config = parseConfig(e.url.search)


    if (config.width > 2000 || config.height > 2000) {
        return makeError("max canvas size 2000x2000")
    }
    
    const canvas = createCanvas(config.width, config.height);
    const ctx = canvas.getContext('2d');


    let canvasRes = await generateImage(ctx, config);


    return new Response(canvas.toBuffer('image/webp', 75), {
        headers: {
            'Content-Type': 'image/webp',
        },
    });
};


