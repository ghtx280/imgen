import type { Ctx, LayerBase, LayerImg, LayerShp, Origin, OriginX, OriginY } from "$lib/types"

export function hex(color: string) {
    return color.replace(/^0x/, "#")
}

export function hex0x(color: string) {
    return color.replace(/^#/, "0x")
}

export function toNum(num: any) {
    if (num !== undefined && num !== null) {
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
        ctx.roundRect(x, y, p.w || 0, p.h || 0, getRound(p))
        ctx.stroke()
        ctx.restore();
    }
}


type DragEvent = Partial<MouseEvent & TouchEvent> & {
    movementX: number;
    movementY: number;
}

type SpeedFunc = (value: string | number, movement: any, ev: DragEvent) => number

export type DragCallback = (event: DragEvent, speed: SpeedFunc) => void

export function drag(node: HTMLElement, callback: DragCallback) {
    function speed(value: string | number, movement: any, ev: DragEvent) {
        return +value + Math.round(ev.shiftKey ? movement * 2 : ev.ctrlKey ? movement / 5 : movement / 2);
    }
    
    let pressed = false;
    let previousTouch: any = null;

    function ffff(event: DragEvent) {
        const t = event.target as HTMLElement
        // console.log(t == node || t.tagName !== "INPUT");
        
        if (t == node || t?.tagName == "CANVAS") 
            event.preventDefault?.();
        if (pressed) callback(event, speed);
    }

    node.addEventListener('mousedown', (ev) => {
        if (ev.buttons == 1) {
            pressed = true
        }
    });
    addEventListener('mouseup', () => (pressed = false));
    node.addEventListener('touchstart', () => (pressed = true));
    addEventListener('touchend', () => (pressed = false));
    addEventListener('mousemove', ffff as (ev: MouseEvent) => any);
    addEventListener('touchend', (e) => (previousTouch = null));
    node.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        if (previousTouch) {
            ffff({
                ...e,
                movementX: touch.pageX - previousTouch.pageX,
                movementY: touch.pageY - previousTouch.pageY,
            });
        }
        previousTouch = touch;
    });
}


export function getRound(p: any) {
    const r = toNum(p.rd) || 0
    const rtl = toNum(p.rdtl) || 0
    const rtr = toNum(p.rdtr) || 0
    const rbl = toNum(p.rdbl) || 0
    const rbr = toNum(p.rdbr) || 0
    
    return [rtl | r, rtr | r, rbr | r, rbl | r]
}