import { createCanvas, loadImage } from 'canvas'

function parseLayersPattern(l) {
    if (!l) return null;

    return l.split('|').map((e) => {
        let [_, type, data, params] = e.match(/(\w+):([^;]+)(?:;(.+))?/);

        params = params?.split(',').map((e) => {
            const [k, v] = e.split(':');
            return [k, +v || v];
        });

        console.log(params);

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
    ctx.clearRect(0, 0, config.width, config.height);

    if (config.fill) {
        ctx.fillStyle = config.fill;
        ctx.fillRect(0, 0, config.width, config.height);
    }

    const create = {
        async img(ctx, p) {
            ctx.save();
            ctx.translate(config.width / 2, config.height / 2);
            ctx.rotate(Math.PI / (180 / p.r));
            ctx.drawImage(
                await loadImage(p.data),
                -config.width / 2 + (p.x || 0),
                -config.height / 2 + (p.y || 0),
                p.w,
                p.h
            );
            ctx.restore();
        },

        async txt(ctx, p) {
            const o_cfg = {
                s: 'start',
                c: 'center',
                e: 'end',
                m: 'middle',
                t: 'top',
                b: 'bottom',
            };
            console.log(p);
            ctx.save();
            ctx.translate(config.width / 2, config.height / 2);
            ctx.rotate(Math.PI / (180 / p.r || 0));
            ctx.fillStyle = p.c || '#000000';
            ctx.font = `${p.s || 16}px ${p.f || 'sans-serif'}`;
            const [ox, oy] = p.o || 'st';
            ctx.textAlign = o_cfg[ox] || 'start';
            ctx.textBaseline = o_cfg[oy] || 'top';
            ctx.fillText(
                p.data || 'lorem',
                -config.width / 2 + (+p.x || 0),
                -config.height / 2 + (+p.y || 0)
                // p.x,
                // p.y,
            );
            ctx.restore();
        },
    };

    for (const cfg of config.layers) {
        try {
            await create[cfg.type]?.(ctx, cfg);
        } catch (e) {
            console.log(e);
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


    return new Response(imageData, { 
        headers: { 
            'Content-Type': 'image/png'
        }
    });
}
