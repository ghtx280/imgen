import { Path2D, createCanvas, loadImage } from '@napi-rs/canvas';
import { error, json } from '@sveltejs/kit';


function makeError(error) {
    return json({ error }, { status: 400 })
}

// @description: wrapText wraps HTML canvas text onto a canvas of fixed width
// @param ctx - the context for the canvas we want to wrap text on
// @param text - the text we want to wrap.
// @param x - the X starting point of the text on the canvas.
// @param y - the Y starting point of the text on the canvas.
// @param maxWidth - the width at which we want line breaks to begin - i.e. the maximum width of the canvas.
// @param lineHeight - the height of each line, so we can space them below each other.
// @returns an array of [ lineText, x, y ] for all lines
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    // First, start by splitting all of our text into words, but splitting it into an array split by spaces
    let words = text.split(' ');
    let space = true

    if (words.length == 1) {
        words = words[0].split("")
        space = false
        // console.log(words);
    }

    

    let line = ''; // This will store the text of the current line
    let testLine = ''; // This will store the text when we add a word, to test if it's too long
    let lineArray = []; // This is an array of lines, which the function will return

    // Lets iterate over each word
    for (var n = 0; n < words.length; n++) {
        // Create a test line, and measure it..
        testLine += `${words[n]}${space ? ' ' : ''}`;
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        // If the width of this test line is more than the max width
        if (testWidth > maxWidth && n > 0) {
            // Then the line is finished, push the current line into "lineArray"
            lineArray.push([line, x, y]);
            // Increase the line height, so a new line is started
            y += lineHeight;
            // Update line and test line to use this word as the first word on the next line
            
            line = `${words[n]}${space ? ' ' : ''}`;
            if (ctx.measureText(testLine).width > maxWidth) {
                line.split("")
            }
            testLine = `${words[n]}${space ? ' ' : ''}`;
        } else {
            // If the test line is still less than the max width, then add the word to the current line
            line += `${words[n]}${space ? ' ' : ''}`;
        }
        // If we never reach the full max width, then there is only one line.. so push it into the lineArray so we return something
        if (n === words.length - 1) {
            lineArray.push([line, x, y]);
        }
    }
    // Return the line array
    return lineArray;
}

function parseLayersPattern(l) {
    if (!l) return null;

    return decodeURIComponent(l)
        .split('|')
        .filter(Boolean)
        .map((e) => {
            let [_, type, data, params] = e.match(/(\w+):([^;]+)(?:;(.+))?/);

            params = params
                ?.split(',')
                .filter(Boolean)
                .map((e) => {
                    const [k, v] = e.split(':');
                    return [k, +v || v];
                });

            return {
                type,
                data,
                ...(params ? Object.fromEntries(params) : {}),
            };
        });
}




async function generateImage(config) {
    const canvas = createCanvas(config.width, config.height);
    const ctx = canvas.getContext('2d');


    if (config.fill) {
        console.log(config.fill);
        ctx.fillStyle = config.fill.replace(/^0x/, "#");
        ctx.fillRect(0, 0, config.width, config.height);
    }

    const create = {
        async img(p) {
            console.log(p.w, p.h);
            p.w = +p.w || config.width;
            p.h = +p.h || config.height;
            p.x = +p.x || 0;
            p.y = +p.y || 0;
            ctx.save();

            ctx.translate(p.w / 2, p.h / 2);
            ctx.rotate(Math.PI / (180 / (+p.r || 0)));

            let region = new Path2D();
            region.roundRect(
                -p.w / 2 + p.x,
                -p.h / 2 + p.y,
                p.w,
                p.h, 
                +p.rd || 0
            );
            ctx.clip(region, 'evenodd');

            

            ctx.drawImage(
                await loadImage(p.data),
                -p.w / 2 + p.x,
                -p.h / 2 + p.y,
                p.w,
                p.h
            );

            ctx.restore();
        },

        async txt(p) {
            // console.log(p);
            const o_cfg = {
                s: 'start',
                c: 'center',
                e: 'end',
                m: 'middle',
                t: 'top',
                b: 'bottom',
            };
            // // console.log(p);
            // ctx.save();
            ctx.translate((+p.x || 0) / 2, (+p.y || 0) / 2);
            ctx.rotate(+p.r || 0);
            ctx.fillStyle = p.c || 'black';
            ctx.font = `${p.s || 16}px ${p.f || 'sans-serif'}`;

            const [ox, oy] = p.o || 'st';

            ctx.textAlign = o_cfg[ox];
            ctx.textBaseline = o_cfg[oy];

            let wrappedText = wrapText(
                ctx, 
                p.data || 'lorem', 
                +p.x / 2 || 0,
                +p.y / 2 || 0,
                +p.max || (config.width - +p.x),
                20
            );

            wrappedText.forEach(function (item) {
                ctx.fillText(item[0], item[1], item[2]);
            });

            // ctx.fillText(
            //     p.data || 'lorem',
            //     +p.x / 2 || 0,
            //     +p.y / 2 || 0,
            // );
        },
    };

    for (const cfg of config.layers) {
        try {
            await create[cfg.type]?.(cfg);
        } catch (e) {
            console.log(e, 'err');
        }
    }

    const imageData = canvas.toBuffer('image/png');

    return imageData;
}



/** @type {import('./$types').RequestHandler} */
export async function GET(e) {
    const layers = parseLayersPattern(e.url.searchParams.get('l')) || [];

    const [width, height] = e.url.searchParams.get('s')?.split('x') || [
        100, 100,
    ];

    if (width > 2000 || height > 2000) {
        return makeError("max canvas size 2000x2000")
    }

    let imageData = await generateImage({
        width: +width,
        height: +height,
        fill: e.url.searchParams.get('fill') || 'white',
        layers,
    });


    return new Response(imageData, {
        headers: {
            'Content-Type': 'image/png',
        },
    });
}
