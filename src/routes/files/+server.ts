import { json, type RequestHandler } from "@sveltejs/kit";
import { join } from "path"
import fs from "fs"
// import fonts from "./fonts/emoji.ttf"
import { read } from "$app/server";

export const GET: RequestHandler = async (e) => {
    
    let fff = e.url.searchParams.get("path")

    console.log(await read(fonts).arrayBuffer());
    


    if (fff) {
        // return json(fs.readdirSync(join(process.cwd(), ...fff.split("/"))));
    }
    
    

    return new Response("not found");
};