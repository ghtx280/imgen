

export async function img(p) {
    p.w = +p.w || this.config.width;
    p.h = +p.h || this.config.height;
    p.x = +p.x || this.config.height / 2;
    p.y = +p.y || this.config.height / 2;


    this.ctx.save();

    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(Math.PI / (180 / (+p.r || 0)));
    // this.ctx.translate(-p.w / 2, -p.h / 2);
    let region = new Path2D();
    region.roundRect(
        (-p.w / 2), (-p.h / 2),
        p.w,
        p.h, 
        +p.rd || 0
    );
    this.ctx.clip(region, 'evenodd');

    

    this.ctx.drawImage(
        p.data?.$name ? p.data.$elem : await loadImage(p.data),
        (-p.w / 2), (-p.h / 2),
        // 0, 0,
        p.w,
        p.h
    );

    this.ctx.restore();
}