import { Path2D, createCanvas, loadImage } from '@napi-rs/canvas'

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
    let line = ''; // This will store the text of the current line
    let testLine = ''; // This will store the text when we add a word, to test if it's too long
    let lineArray = []; // This is an array of lines, which the function will return

    // Lets iterate over each word
    for(var n = 0; n < words.length; n++) {
        // Create a test line, and measure it..
        testLine += `${words[n]} `;
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        // If the width of this test line is more than the max width
        if (testWidth > maxWidth && n > 0) {
            // Then the line is finished, push the current line into "lineArray"
            lineArray.push([line, x, y]);
            // Increase the line height, so a new line is started
            y += lineHeight;
            // Update line and test line to use this word as the first word on the next line
            line = `${words[n]} `;
            testLine = `${words[n]} `;
        }
        else {
            // If the test line is still less than the max width, then add the word to the current line
            line += `${words[n]} `;
        }
        // If we never reach the full max width, then there is only one line.. so push it into the lineArray so we return something
        if(n === words.length - 1) {
            lineArray.push([line, x, y]);
        }
    }
    // Return the line array
    return lineArray;
}


function parseLayersPattern(l) {
    if (!l) return null;

    return decodeURIComponent(l).split('|').filter(Boolean).map((e) => {
        let [_, type, data, params] = e.match(/(\w+):([^;]+)(?:;(.+))?/);

        params = params?.split(',').filter(Boolean).map((e) => {
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

function svgImage(data) {
    return `<svg width="228" height="256" viewBox="0 0 228 256" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <rect width="228" height="256" rx="42" fill="url(#pattern0)"/>
    <defs>
    <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
    <use xlink:href="#image0_627_72" transform="matrix(0.0015638 0 0 0.00139276 -0.000415384 0)"/>
    </pattern>
    <image id="image0_627_72" width="640" height="718" xlink:href="${data}"/>
    </defs>
    </svg>`
    
}

async function generateImage(config) {
    // Create canvas
    const canvas = createCanvas(config.width, config.height);
    const ctx = canvas.getContext('2d');

    // Clear canvas
    // ctx.clearRect(0, 0, config.width, config.height);

    if (config.fill) {
        ctx.fillStyle = config.fill;
        ctx.fillRect(0, 0, config.width, config.height);
    }

    // new XMLSerializer().serializeToString()

    // ctx.translate(0, 0);
    // ctx.rotate(Math.PI / (180 / 0 || 0));
    // // ctx.rotate(Math.PI / (180 / 45 || 0));
    // ctx.fillStyle = "red"
    // ctx.font = '24px Arial';
    // ctx.textBaseline = "top"
    // ctx.textAlign = "start"
    // ctx.fillText(
    //     'lorem',
    //     0,
    //     0
    //     // p.x,
    //     // p.y,
    // );

    const create = {
        async img(p) {
            console.log(p.w, p.h);
            p.w = +p.w || config.width
            p.h = +p.h || config.height
            p.x = +p.x || 0
            p.y = +p.y || 0
            ctx.save();
        

            let region = new Path2D();
            region.roundRect(
                p.x,
                p.y,
                p.w,
                p.h,
                +p.rd || 0
            );
            ctx.clip(region, "evenodd");
            

            
            ctx.translate(p.w / 2, p.h / 2);
            ctx.rotate(Math.PI / (180 / (+p.r || 0)));

            
            ctx.drawImage(
                await loadImage(p.data),
                (-p.w / 2) + p.x,
                (-p.h / 2) + p.y,
                p.w,
                p.h,
                // 0,
                // 0,
                // 100,
                // 100
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
            ctx.translate(+p.x || 0, +p.y || 0);
            ctx.rotate(+p.r || 0)
            ctx.fillStyle = p.c || 'black';
            ctx.font = `${p.s || 16}px ${p.f || 'sans-serif' }`;

            const [ox, oy] = p.o || 'st';

            
            ctx.textAlign    = o_cfg[ox];
            ctx.textBaseline = o_cfg[oy];

            let wrappedText = wrapText(ctx, p.data || "lorem", 600, 200, 20, 5)
            // wrappedTe
            wrappedText.forEach(function(item) {
                ctx.fillText(item[0], item[1], item[2]); 
            })

            ctx.fillText( p.data || "lorem" , 0, 0);
        },
    };

    for (const cfg of config.layers) {
        try {
            await create[cfg.type]?.(cfg);
        } catch (e) {
            console.log(e, "err");
        }
    }

    const imageData = canvas.toBuffer('image/png');

    return imageData;
}


{/* <svg width="228" height="256" viewBox="0 0 228 256" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="228" height="256" rx="42" fill="url(#pattern0)"/>
<defs>
<pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_627_72" transform="matrix(0.0015638 0 0 0.00139276 -0.000415384 0)"/>
</pattern>
<image id="image0_627_72" width="640" height="718" xlink:href="data:image/png;base64,iVBORw"/>
</defs>
</svg>



<svg width="228" height="256" viewBox="0 0 228 256" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<mask id="mask0_627_71" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="228" height="256">
<rect width="228" height="256" rx="999" fill="#D9D9D9"/>
</mask>
<g mask="url(#mask0_627_71)">
<rect width="228" height="256" fill="url(#pattern0)"/>
</g>
<defs>
<pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_627_71" transform="matrix(0.0015638 0 0 0.00139276 -0.000415384 0)"/>
</pattern>
<image id="image0_627_71" width="640" height="718" xlink:href="data:image/png;base64,iVBORw0KGgo"/>
</defs>
</svg>



<svg width="247" height="242" viewBox="0 0 247 242" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_627_74)">
<rect width="247" height="242" fill="#CB3030"/>
</g>
<defs>
<clipPath id="clip0_627_74">
<rect width="247" height="242" rx="53" fill="white"/>
</clipPath>
</defs>
</svg>


<svg width="247" height="242" viewBox="0 0 247 242" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g clip-path="url(#clip0_627_74)">
<rect width="247" height="242" fill="url(#pattern0)"/>
</g>
<defs>
<pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_627_74" transform="matrix(0.0015625 0 0 0.00159478 0 -0.0725271)"/>
</pattern>
<clipPath id="clip0_627_74">
<rect width="247" height="242" rx="53" fill="white"/>
</clipPath>
<image id="image0_627_74" width="640" height="718" xlink:href="data:image/png;base64,iVBORw0KGgoAAAuQmCC"/>
</defs>
</svg> */}





// s=400x400

// l=
//     txt:hello
//     |txt:fff;
//         x:150,y:150,o:cm,f:serif,c:white,s:50
//     |img:https://upload.wikimedia.org/wikipedia/en/9/9a/Trollface_non-free.png;
//         x:100,w:100,h:100

// fill=red



// "? size=100x100 & fill = #ff0000 & l1=   img:link;100x100;0:0;0  &  l2=  text:hello+world:24:50"

/** @type {import('./$types').RequestHandler} */
export async function GET(e) {
    const layers = parseLayersPattern(e.url.searchParams.get('l')) || [];

    const [width, height] = e.url.searchParams.get('s')?.split('x') || [
        100, 100,
    ];


    let imageData = await generateImage({
        width: +width,
        height: +height,
        fill: e.url.searchParams.get('fill') || 'white',
        layers,
    })


    // const { createCanvas, loadImage } = require('@napi-rs/canvas')

    // const canvas = createCanvas(300, 320)
    // const ctx = canvas.getContext('2d')


    // ctx.save();
    // ctx.font = '100px COLRv1'
    // ctx.fillText('abc', 50, 300)
    // ctx.restore();

    // const imageData = canvas.toBuffer('image/png')

    // console.log(imageData);


    return new Response(imageData, { 
        headers: { 
            'Content-Type': 'image/png'
        }
    });
}
