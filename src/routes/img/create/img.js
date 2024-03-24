

export async function img(p) {
    p.w = +p.w || this.config.width;
    p.h = +p.h || this.config.height;
    p.x = +p.x || 0;
    p.y = +p.y || 0;


    this.ctx.save();

    this.ctx.translate(p.w / 2, p.h / 2);
    this.ctx.rotate(Math.PI / (180 / (+p.r || 0)));

    let region = new Path2D();
    region.roundRect(
        -p.w / 2 + p.x,
        -p.h / 2 + p.y,
        p.w,
        p.h, 
        +p.rd || 0
    );
    this.ctx.clip(region, 'evenodd');

    

    this.ctx.drawImage(
        await loadImage(p.data),
        -p.w / 2 + p.x,
        -p.h / 2 + p.y,
        p.w,
        p.h
    );

    this.ctx.restore();
}