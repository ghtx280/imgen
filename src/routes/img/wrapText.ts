import type { Ctx, LayerBase } from "$lib/types";



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
    oy: number, 
    p: LayerBase
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


    for (var n = 0; n < words.length; n++) {

        testLine += `${words[n]}${space ? ' ' : ''}`;
        let metrics = ctx.measureText(testLine);
        let testWidth = caclOrigin(metrics.width)[ox]


        if (testWidth > maxWidth && n > 0) {
            lineArray.push({ text: line, x, y, w: testWidth });
            y += lineHeight;
            line = `${words[n]}${space ? ' ' : ''}`;
            if (ctx.measureText(testLine).width > maxWidth) {
                line.split("")
            }
            testLine = `${words[n]}${space ? ' ' : ''}`;
            linesCount++
            
            
        } else {
            line += `${words[n]}${space ? ' ' : ''}`;
            totalWidth = testWidth
        }
   
        if (n === words.length - 1) {
            lineArray.push({ text: line, x, y, w: testWidth });
        }
    }
    // Return the line array
    return {
        lines: lineArray,
        count: linesCount,
        width: totalWidth
    };
}