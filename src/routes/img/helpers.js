export function hex(color) {
    return color.replace(/^0x/, "#")
}

export function hex0x(color) {
    return color.replace(/^#/, "0x")
}
