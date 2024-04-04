import { GlobalFonts, Path2D, createCanvas, loadImage } from '@napi-rs/canvas';
import { json, type RequestHandler } from '@sveltejs/kit';
import { generateImage } from '../../lib/generate.js';
import parseConfig from '../../lib/parseConfig.js';

// @ts-ignore
import url from "node:url";
// @ts-ignore
import { join } from "node:path";
import { read } from '$app/server';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const fonts = import.meta.glob("/static/fonts/**/*.ttf", {
    as: "url",
    eager: true
})

function makeError(error: string) {
    return json({ error }, { status: 400 })
}

let once = false;

if (!once) {
    Object.values(fonts).map(file => {
        GlobalFonts.registerFromPath(join(process.cwd(), file))
    })
    once = true;
}



export const GET: RequestHandler = async (e) => {

    // console.log(GlobalFonts.families.filter(e => e.family.startsWith("Mont"))[0].styles);
    

    if (e.url.searchParams.get("fonts") !== null) {
        return json(fonts)
    }
    
    
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


    return new Response(canvas.toBuffer('image/webp'), {
        headers: {
            'Content-Type': 'image/webp',
        },
    });
};


