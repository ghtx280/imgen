import type { Ctx, ItemThis, LayerShp } from "$lib/types";
import { CreateStroke, getRound, hex, parseOrigin, toNum } from "../helpers";


const origin = (v: number) => ({
    s: 0,
    c: -v / 2 ,
    e: -v ,
    t: 0,
    m: -v / 2,
    b: -v ,
})

// const shapes = {
//     rect(ctx: Ctx, p: LayerShp) {
//         ctx.translate(p.x, p.y);
//         ctx.rotate(Math.PI / (180 / (toNum(p.r) || 0)));
//         ctx.roundRect(x, y, p.w, p.h, toNum(p.rd) || 0);
//     }
// }



export default async function(this: ItemThis, p: LayerShp) {
    p.x = toNum(p.x) ?? 0;
    p.y = toNum(p.y) ?? 0;
    p.w = toNum(p.w) ?? this.config.width;
    p.h = toNum(p.h) ?? this.config.height;
    
    this.ctx.save();

    let [ox, oy] = parseOrigin(p.o || 'st'); 

    let x = origin(p.w)[ox];
    let y = origin(p.h)[oy];

    if (p.data == "rect") {        
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(Math.PI / (180 / (toNum(p.r) || 0)));
        
        CreateStroke(this.ctx, p, x, y)

        this.ctx.fillStyle = hex(p.c || "#000000")
        this.ctx.beginPath();
        
        this.ctx.roundRect(x, y, p.w, p.h, getRound(p));
        this.ctx.fill();

    }

    this.ctx.restore();
}
