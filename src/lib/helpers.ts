import type { Ctx, LayerBase, LayerImg, LayerShp, Origin, OriginX, OriginY } from "$lib/types"

export function hex(color: string) {
    return color.replace(/^0x/, "#")
}

export function hex0x(color: string) {
    return color.replace(/^#/, "0x")
}

export function toNum(num: any) {
    if (num !== undefined || num !== null) {
        return Number(num)
    }
}

export function parseOrigin(o: Origin): [OriginX, OriginY] {
    let x: OriginX = o[0] as OriginX
    let y: OriginY = o[1] as OriginY

    return [x, y]
}


export function CreateStroke(ctx: Ctx, p: LayerBase & LayerShp, x: number, y: number) {
    if (toNum(p.bw)) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = hex(p.bc || "#000000");
        ctx.lineWidth = toNum(p.bw) || 0
        ctx.roundRect(x, y, p.w || 0, p.h || 0, toNum(p.rd) || 0)
        ctx.stroke()
        ctx.restore();
    }
}