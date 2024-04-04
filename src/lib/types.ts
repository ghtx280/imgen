import type { SKRSContext2D } from "@napi-rs/canvas"

export type Config = {
    fill: string
    width: number
    height: number
    layers: Layers
}

export type Layers = LayerImg[] | LayerTxt[] | LayerShp[]

type Data = { $name: string, $elem: CanvasImageSource }

export type Origin = "st" | "sm" | "sb" | "ct" | "cm" | "cb" | "et" | "em" | "eb" 
export type OriginX = "s" | "c" | "e"
export type OriginY = "t" | "m" | "b"

export type LayerBase = {
    type: "txt" | "img" | "shp",
    data: Data | string
    x?: number
    y?: number
    r?: number
    o?: Origin
    bc?: string
    bw?: number

    $x?: number
    $y?: number
    $w?: number
    $h?: number
    $s?: boolean
}

export type LayerImg = {
    w?: number
    h?: number
    rd?: number
} & LayerBase

export type LayerShp = {
    w?: number
    h?: number
    rd?: number
    c?: string
} & LayerBase

export type LayerTxt = {
    f?: string
    c?: string
    w?: number
    s?: number
    max?: number
    lh?: number
} & LayerBase

export type Ctx = CanvasRenderingContext2D | SKRSContext2D
export type Canvas = HTMLCanvasElement

export type ItemThis = {
    ctx: Ctx,
    config: Config
}