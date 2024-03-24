import { GlobalFonts, Path2D, createCanvas, loadImage } from '@napi-rs/canvas';
import { json } from '@sveltejs/kit';
import parseLayersPattern from './parseLayersPattern.js';
import { generateImage } from './generate.js';


function makeError(error) {
    return json({ error }, { status: 400 })
}





/** @type {import('./$types').RequestHandler} */
export async function GET(e) {
    globalThis.Path2D = Path2D
    globalThis.loadImage = loadImage

    const [width, height] = e.url.searchParams.get('s')?.split('x') || [
        100, 100,
    ];

    
    const canvas = createCanvas(+width, +height);
    const ctx = canvas.getContext('2d');

    const layers = parseLayersPattern(e.url.searchParams.get('l')) || [];

    if (width > 2000 || height > 2000) {
        return makeError("max canvas size 2000x2000")
    }

    let canvasRes = await generateImage(ctx, {
        width:  +width,
        height: +height,
        fill: e.url.searchParams.get('fill') || 'white',
        layers,
    });


    return new Response(canvasRes.toBuffer('image/png'), {
        headers: {
            'Content-Type': 'image/png',
        },
    });
}
