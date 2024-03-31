import { GlobalFonts, Path2D, createCanvas, loadImage } from '@napi-rs/canvas';
import { json, type RequestHandler } from '@sveltejs/kit';
import { generateImage } from '../../lib/generate.js';
import parseConfig from '../../lib/parseConfig.js';


import url from "node:url";
import { join } from "node:path";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
// import Emoji from '$lib/fonts/Emoji.ttf';


function makeError(error: string) {
    return json({ error }, { status: 400 })
}

let once = false;





export const GET: RequestHandler = async (e) => {

    const fonts = {
        Emoji: "emoji.ttf",
    }
    
    // "../../../"
    
    if (!once) {
        Object.entries(fonts).map(([name, file]) => {
            GlobalFonts.registerFromPath(join(process.cwd(), "fonts", file), name)
            console.log(process.cwd());
            
        })
        once = true
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


    return new Response(canvas.toBuffer('image/webp', 75), {
        headers: {
            'Content-Type': 'image/webp',
        },
    });
};


