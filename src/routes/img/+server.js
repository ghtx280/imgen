import { createCanvas, loadImage } from '@napi-rs/canvas'

function parseLayersPattern(l) {
    if (!l) return null;

    return decodeURIComponent(l).split('|').map((e) => {
        let [_, type, data, params] = e.match(/(\w+):([^;]+)(?:;(.+))?/);

        params = params?.split(',').map((e) => {
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
    // Create canvas
    const canvas = createCanvas(config.width, config.height);
    const ctx = canvas.getContext('2d');

    // Clear canvas
    // ctx.clearRect(0, 0, config.width, config.height);

    if (config.fill) {
        ctx.fillStyle = config.fill;
        ctx.fillRect(0, 0, config.width, config.height);
    }

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
            ctx.save();
            ctx.translate(+p.x || 0, +p.y || 0);
            ctx.rotate(+p.r || 0);
            ctx.drawImage(
                await loadImage(p.data),
                (+p.x || 0) / 2, (+p.y || 0) / 2, p.w, p.h
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

            ctx.fillText( p.data || "lorem" , 0, 0 );
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
