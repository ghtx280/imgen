import { toNum } from "$lib/helpers";
import type { Ctx, LayerBase, LayerTxt } from "$lib/types";



const caclOrigin = (w: number) => ({
    s: w,
    c: w / 2,
    e: 0
})


export default function(
    ctx: Ctx, 
    text: string, 
    x: number, 
    y: number, 
    maxWidth: number, 
    lineHeight: number, 
    ox: "s" | "c" | "e", 
    oy: "t" | "m" | "b", 
    p: LayerBase & LayerTxt
) {
    // First, start by splitting all of our text into words, but splitting it into an array split by spaces
    let words = text.split(' ').filter(Boolean);
    let space = true

    if (words.length == 1) {
        // words = words[0].split("")
        // space = false
        // console.log(words);
    }

    

    let line = '';
    let testLine = '';
    let lineArray = [];
    let linesCount = 1
    let totalWidth = 0
    let totalHeight = toNum(p.s)


    for (var n = 0; n < words.length; n++) {

        testLine += `${words[n]}${space ? ' ' : ''}`;
        let metrics = ctx.measureText(testLine);
        // let testWidth = caclOrigin(metrics.width)[ox]
        let originalWidth = metrics.width
        let testWidth = caclOrigin(originalWidth)[ox]

        // console.log(metrics);
        


        if (testWidth > maxWidth && n > 0) {
            lineArray.push({ text: line, x, y, w: testWidth });
            y += lineHeight;
            line = `${words[n]}${space ? ' ' : ''}`;
            if (ctx.measureText(testLine).width > maxWidth) {
                line.split("")
            }
            testLine = `${words[n]}${space ? ' ' : ''}`;
            linesCount++
            // totalHeight += metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent + (toNum(p.s) / 2)  + lineHeight;
            
            
        } else {
            line += `${words[n]}${space ? ' ' : ''}`;
            totalWidth = originalWidth
        }
   
        if (n === words.length - 1) {
            lineArray.push({ text: line, x, y, w: originalWidth, h: toNum(p.s) });
        }
    }
    // Return the line array
    return {
        lines: lineArray,
        count: linesCount,
        width: totalWidth,
        height: totalHeight
    };
}