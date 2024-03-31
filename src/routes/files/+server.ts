import { json, type RequestHandler } from "@sveltejs/kit";
import { join } from "path"
import fs from "fs"

export const GET: RequestHandler = async (e) => {
    
    let fff = e.url.searchParams.get("path")


    if (fff) {
        return json(fs.readdirSync(join(process.cwd(), ...fff.split("/"))));
    }
    
    

    return new Response("not found");
};