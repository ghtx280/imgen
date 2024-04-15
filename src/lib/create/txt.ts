import type { ItemThis, LayerTxt, OriginX, OriginY } from '$lib/types';
import { hex, toNum } from '../helpers';
import wrapText from '../../routes/img/wrapText';

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
    let color = p.c || '#000000';
    let font = p.f || 'Inter, sans-serif';
    let size = p.s || 16;

    let data = p.data || 'lorem';

    // let [ox, oy] = p?.o || 'st';

    let ox = (p.o?.[0] as OriginX) || 's'
    let oy = (p.o?.[1] as OriginY) || 't'

    // TODO: FIX THIS!!!
    if (font.toLowerCase().includes("emoji")) {
        ox = "s"
        oy = "m"  
    }

    p.lh = toNum(p.lh) || 15
    
    

    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(Math.PI / (180 / rotate));

    // this.ctx.fillStyle = hex(color);
    // this.ctx.font = `${p.w || 500} ${size}px ${font}`;
    // // console.log(this.ctx.font);
    // this.ctx.textAlign = origin[ox] as CanvasTextAlign;
    // this.ctx.textBaseline = origin[oy] as CanvasTextBaseline;

    const setStyles = () => {
        this.ctx.fillStyle = hex(color);
        this.ctx.font = `${p.w || 500} ${size}px ${font}`;
        this.ctx.textAlign = origin[ox] as CanvasTextAlign;
        this.ctx.textBaseline = origin[oy] as CanvasTextBaseline;
    }

    setStyles()    

    let wrappedText = wrapText(
        this.ctx,
        data as string,
        0,
        0,
        toNum(p.mw) || cw - x,
        size * (p.lh / 10),
        ox,
        oy,
        p
    );

    

    wrappedText.lines.forEach(({ text, x, y, w, h }) => {
        // stroke text
        if (toNum(p.bw)) {
            setStyles()
            this.ctx.strokeStyle = hex(p.bc || "#000000");
            this.ctx.lineWidth = toNum(p.bw) || 0 
            this.ctx.strokeText(text, x, y)
        }
        

        // fill text
        setStyles()
        this.ctx.fillText(text, x, y)

        // this.ctx.strokeStyle = 'red';
        // this.ctx.lineWidth = 2;
        // this.ctx.strokeRect(x, y, w, h);
        
        // this.ctx.
        
    });

    
    

    p.$w = toNum(p.mw) || wrappedText.width
    p.$h = size + ((wrappedText.count - 1) * (size * (p.lh / 10)))


    // console.log(p.$h);

    // p.$h = wrappedText.height

    // const caclOrigin = (w: number) => ({
    //     s: w,
    //     c: w / 2,
    //     e: 0
    // })

    // p.$x = ox == "s" ? 0 : ox == "c" ? -p.$w : -p.$w

    this.ctx.restore();

    // this.ctx.strokeStyle = "#173f8a"
    // this.ctx.lineWidth = 2
    // this.ctx.beginPath()
    // this.ctx.rect(x, y, p.$w, p.$h)
    // this.ctx.stroke()
}
