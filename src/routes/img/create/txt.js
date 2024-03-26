import { hex } from '../helpers.js';
import wrapText from '../wrapText.js';

const origin = {
    s: 'start',
    c: 'center',
    e: 'end',
    m: 'middle',
    t: 'top',
    b: 'bottom',
};

export async function txt(p) {
    let cw = this.config.width;
    let hw = this.config.height;

    let x = +p.x ?? 0;
    let y = +p.y ?? 0;
    let rotate = +p.r || 0;
    let color = p.c || 'black';
    let font = p.f || 'sans-serif';
    let size = p.s || 16;

    let data = p.data || 'lorem';

    let [ox, oy] = p.o || 'st';

    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(Math.PI / (180 / rotate));

    this.ctx.fillStyle = hex(color);
    this.ctx.font = `${p.w || 500} ${size}px ${font}`;
    // console.log(this.ctx.font);
    this.ctx.textAlign = origin[ox];
    this.ctx.textBaseline = origin[oy];

    let wrappedText = wrapText(
        this.ctx,
        data,
        0,
        0,
        +p.max || cw - x,
        +p.lh || 50,
        ox,
        oy
    );

    wrappedText.forEach((i) => this.ctx.fillText(i[0], i[1], i[2]));

    this.ctx.restore();
}
