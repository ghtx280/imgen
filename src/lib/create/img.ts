import type { ItemThis, LayerShp } from "$lib/types";
import { CreateStroke, hex, parseOrigin, toNum } from "../helpers";

const origin = (v: number) => ({
    s: 0,
    c: -v / 2 ,
    e: -v ,
    t: 0,
    m: -v / 2,
    b: -v ,
})

export default async function(this: ItemThis, p: LayerShp) {
    p.w = toNum(p.w) ?? this.config.width;
    p.h = toNum(p.h) ?? this.config.height;
    p.x = toNum(p.x) ?? this.config.height / 2;
    p.y = toNum(p.y) ?? this.config.height / 2;

    this.ctx.save();
    

    let [ox, oy] = parseOrigin(p.o || 'st'); 

    let x = origin(p.w)[ox];
    let y = origin(p.h)[oy];


    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(Math.PI / (180 / (toNum(p.r) || 0)));

    // if (toNum(p.bw)) {
    //     this.ctx.save();
    //     this.ctx.beginPath();
    //     this.ctx.strokeStyle = hex(p.bc || "#000000");
    //     this.ctx.lineWidth = toNum(p.bw) || 0
    //     this.ctx.roundRect(x, y, p.w, p.h, toNum(p.rd) || 0)
    //     this.ctx.stroke()
    //     this.ctx.restore();
    // }

    CreateStroke(this.ctx, p, x, y)

    let region = new Path2D();
    region.roundRect(x, y, p.w, p.h, toNum(p.rd) || 0);
    this.ctx.clip(region, 'evenodd');

    
    if (typeof p.data == "string") {
        p.data = {
            // @ts-ignore
            $elem: await loadImage(p.data),
            $name: p.data + "",
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





