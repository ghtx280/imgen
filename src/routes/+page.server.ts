import type { PageServerLoad } from "./$types";

const fonts = import.meta.glob("/static/fonts/*/*.ttf")

export const load: PageServerLoad = async (e) => {

    let fontNames: any = {}
    

    Object.keys(fonts).map(e => {
        let name = e.match(/fonts\/(.+?)\//)?.[1] || ""

        fontNames[name.replace(/_/g, " ")] = true
    })

    return { fontNames: Object.keys(fontNames), fontFiles: Object.keys(fonts) }
};