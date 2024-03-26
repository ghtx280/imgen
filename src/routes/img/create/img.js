

const origin = v => ({
    s: 0,
    c: -v / 2 ,
    e: -v ,
    t: 0,
    m: -v / 2,
    b: -v ,
})

export async function img(p) {
    p.w = +p.w ?? this.config.width;
    p.h = +p.h ?? this.config.height;
    p.x = +p.x ?? this.config.height / 2;
    p.y = +p.y ?? this.config.height / 2;

    this.ctx.save();

    let [ox, oy] = p.o || 'st';

    ox = origin(p.w)[ox];
    oy = origin(p.h)[oy];


    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(Math.PI / (180 / (+p.r || 0)));
    // this.ctx.translate(-p.w / 2, -p.h / 2);
    let region = new Path2D();
    region.roundRect(ox, oy, p.w, p.h, +p.rd || 0);
    this.ctx.clip(region, 'evenodd');

    if (!p.data?.$elem) {
        p.data = {
            $elem: await loadImage(p.data),
            $name: p.data,
        };
    }

    this.ctx.drawImage(
        p.data?.$elem,
        // -p.w / 2,
        // -p.h / 2,
        ox, oy,
        p.w,
        p.h
    );

    this.ctx.restore();
}
