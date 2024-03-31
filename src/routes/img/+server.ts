import { GlobalFonts, Path2D, createCanvas, loadImage } from '@napi-rs/canvas';
import { json, type RequestHandler } from '@sveltejs/kit';
import { generateImage } from '../../lib/generate.js';
import parseConfig from '../../lib/parseConfig.js';


import url from "node:url";
import { join, relative } from "node:path";
import { read } from '$app/server';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// import Emoji from './fonts/emoji.ttf';

const fff = import.meta.glob("/fonts/*", {
    as: "url",
    eager: true
})

function makeError(error: string) {
    return json({ error }, { status: 400 })
}

let once = false;

// const fonts = {
//     Emoji: "emoji.ttf",
// }


if (!once) {
    Object.entries(fff).map(async ([name, file]) => {
        name = name.match(/fonts\/(.+)\./)?.[1] || ""

        console.log( file );
        

        console.log(join(process.cwd(), file), name);
        
        // let ddd = await read(file).arrayBuffer()
        
        GlobalFonts.registerFromPath(join(process.cwd(), file), name) 
    })
}



export const GET: RequestHandler = async (e) => {

    // console.dir();

    if (e.url.searchParams.get("fonts")) {
        return new Response(GlobalFonts.families.map(e=>e.family).join("\n-------------\n"))
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


