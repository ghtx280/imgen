import type { ItemThis, LayerShp } from "$lib/types";
import { CreateStroke, getRound, hex, parseOrigin, toNum } from "../helpers";

const origin = (v: number) => ({
    s: 0,
    c: -v / 2 ,
    e: -v ,
    t: 0,
    m: -v / 2,
    b: -v ,
})

export default async function(this: ItemThis, p: LayerShp) {
    p.x = toNum(p.x) ?? 0;
    p.y = toNum(p.y) ?? 0;
    p.w = toNum(p.w) ?? this.config.width;
    p.h = toNum(p.h) ?? this.config.height;

    this.ctx.save();
    

    let [ox, oy] = parseOrigin(p.o || 'st'); 

    let x = origin(p.w)[ox];
    let y = origin(p.h)[oy];


    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(Math.PI / (180 / (toNum(p.r) || 0)));


    CreateStroke(this.ctx, p, x, y)

    
    

    let region = new Path2D();
    region.roundRect(x, y, p.w, p.h, getRound(p));
    this.ctx.clip(region, 'evenodd');


    // console.log(p.data, "server");
    
    
    if (typeof p.data == "string") {
        const dec = decodeURIComponent(p.data);
        p.data = {
            // @ts-ignore
            $elem: await loadImage(dec),
            // @ts-ignore
            $name: dec,
        };
    }

    

    // @ts-ignore
    this.ctx.drawImage(
        p.data.$elem,
        x, y,
        p.w,
        p.h
    );

    this.ctx.restore();
}





