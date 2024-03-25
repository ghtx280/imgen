import { GlobalFonts, Path2D, createCanvas, loadImage } from '@napi-rs/canvas';
import { json } from '@sveltejs/kit';
import { generateImage } from './generate.js';
import parseConfig from './parseConfig.js';


function makeError(error) {
    return json({ error }, { status: 400 })
}


/** @type {import('./$types').RequestHandler} */
export async function GET(e) {
    globalThis.Path2D = Path2D
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
}
