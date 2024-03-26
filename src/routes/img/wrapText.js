


const caclOrigin = w => ({
    s: w,
    c: w / 2,
    e: 0
})


export default function(ctx, text, x, y, maxWidth, lineHeight, ox, oy) {
    // First, start by splitting all of our text into words, but splitting it into an array split by spaces
    let words = text.split(' ');
    let space = true

    if (words.length == 1) {
        // words = words[0].split("")
        // space = false
        // console.log(words);
    }

    

    let line = ''; // This will store the text of the current line
    let testLine = ''; // This will store the text when we add a word, to test if it's too long
    let lineArray = []; // This is an array of lines, which the function will return

    // Lets iterate over each word
    for (var n = 0; n < words.length; n++) {
        // Create a test line, and measure it..
        testLine += `${words[n]}${space ? ' ' : ''}`;
        let metrics = ctx.measureText(testLine);
        let testWidth = caclOrigin(metrics.width)[ox];

        // If the width of this test line is more than the max width
        if (testWidth > maxWidth && n > 0) {
            // Then the line is finished, push the current line into "lineArray"
            lineArray.push([line, x, y]);
            // Increase the line height, so a new line is started
            y += lineHeight;
            // Update line and test line to use this word as the first word on the next line
            
            line = `${words[n]}${space ? ' ' : ''}`;
            if (ctx.measureText(testLine).width > maxWidth) {
                line.split("")
            }
            testLine = `${words[n]}${space ? ' ' : ''}`;
        } else {
            // If the test line is still less than the max width, then add the word to the current line
            line += `${words[n]}${space ? ' ' : ''}`;
        }
        // If we never reach the full max width, then there is only one line.. so push it into the lineArray so we return something
        if (n === words.length - 1) {
            lineArray.push([line, x, y]);
        }
    }
    // Return the line array
    return lineArray;
}