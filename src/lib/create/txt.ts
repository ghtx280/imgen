import type { ItemThis, LayerTxt, OriginX, OriginY } from '$lib/types.js';
import { hex, toNum } from '../helpers.js';
import wrapText from '../../routes/img/wrapText.js';

const origin = {
    s: 'start',
    c: 'center',
    e: 'end',
    m: 'middle',
    t: 'top',
    b: 'bottom',
};

export default async function(this: ItemThis, p: LayerTxt) {
    let cw = this.config.width;
    let hw = this.config.height;

    let x = toNum(p.x) ?? 0;
    let y = toNum(p.y) ?? 0;

    let rotate = toNum(p.r) || 0;
    let color = p.c || 'black';
    let font = p.f || 'sans-serif';
    let size = p.s || 16;

    let data = p.data || 'lorem';

    // let [ox, oy] = p?.o || 'st';

    let ox = (p.o?.[0] as OriginX) || 's'
    let oy = (p.o?.[1] as OriginY) || 't'

    
    

    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(Math.PI / (180 / rotate));

    this.ctx.fillStyle = hex(color);
    this.ctx.font = `${p.w || 500} ${size}px ${font}`;
    // console.log(this.ctx.font);
    this.ctx.textAlign = origin[ox] as CanvasTextAlign;
    this.ctx.textBaseline = origin[oy] as CanvasTextBaseline;

    let wrappedText = wrapText(
        this.ctx,
        data,
        0,
        0,
        toNum(p.max) || cw - x,
        p.lh ? size * (p.lh / 10) : size * 15,
        ox,
        oy
    );

    wrappedText.forEach((i) => this.ctx.fillText(i[0], i[1], i[2]));

    this.ctx.restore();
}
