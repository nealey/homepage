const glyphs = [
    "\\x00", "\\x01", "\\x02", "\\x03", "\\x04", "\\x05", "\\x06", "\\x07",
    "\\x08", "\\x09", "\\x0A", "\\x0B", "\\x0C", "\\x0D", "\\x0E", "\\x0F",
    "⏵", "⏴", "↕", "‼", "¶", "§", "‽", "↨", "↑", "↓", "→", "←", "∟", "↔", "⏶", "⏷",
    " ", "!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?",
    "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
    "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_",
    "`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
    "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~", "⌂",

    "Ç", "ü", "é", "â", "ä", "à", "å", "ç", "ê", "ë", "è", "ï", "î", "ì", "Ä", "Å",
    "É", "æ", "Æ", "ô", "ö", "ò", "û", "ù", "ÿ", "Ö", "Ü", "¢", "£", "¥", "₧", "ƒ",
    "á", "í", "ó", "ú", "ñ", "Ñ", "ª", "º", "¿", "⌐", "¬", "½", "¼", "¡", "«", "»",
    "░", "▒", "▓", "│", "┤", "╡", "╢", "╖", "╕", "╣", "║", "╗", "╝", "╜", "╛", "┐",
    "└", "┴", "┬", "├", "─", "┼", "╞", "╟", "╚", "╔", "╩", "╦", "╠", "═", "╬", "╧",
    "╨", "╤", "╥", "╙", "╘", "╒", "╓", "╫", "╪", "┘", "┌", "█", "▄", "▌", "▐", "▀",
    "α", "ß", "Γ", "π", "Σ", "σ", "µ", "τ", "Φ", "Θ", "Ω", "δ", "∞", "φ", "ε", "∩",
    "≡", "±", "≥", "≤", "⌠", "⌡", "÷", "≈", "°", "∞", "⊻", "√", "ⁿ", "²", "■", "¤",
]

/**
 * Encode a buffer using fluffy glyphs
 * 
 * @param {Uint8Array} buf Buffer to encode
 * @returns {String} Glyph-encoded string
 */
function Stringify(buf) {
    let ret = []
    for (let i of buf) {
        ret.push(glyphs[i])
    }
    return ret.join("")
}


/**
 * Hex encode a buffer
 * 
 * @param {Uint8Array} buf Buffer to encode
 * @returns {String} Hexlified version
 */
function Hexlify(buf) {
    let ret = []
    for (let b of buf) {
        let hex = "00" + b.toString(16)
        ret.push(hex.slice(-2))
    }
    return ret.join(" ")
}

/**
 * Hex decode a string
 * 
 * @param {String} str String to decode
 * @returns {Uint8Array} Decoded array
 */
function Unhexlify(str) {
    let a = []
    let match = str.match(/[0-9a-fA-F]{2}/g) || []
    for (let m of match) {
        a.push(parseInt(m, 16))
    }
    return new Uint8Array(a)
}

/**
 * Read a NULL-Terminated string from a buffer.
 * 
 * @param {Uint8Arrary} buf Buffer to read
 * @param {Boolean} includeNull True to include the trailing NUL
 * @returns {Uint8Array} String
 */
function CString(buf, includeNull=false) {
    let end = buf.indexOf(0)
    if (end == -1) {
        return buf
    }
    return buf.slice(0, end + (includeNull?1:0))
}

/**
 * Unescapes a string with things like "\x02" in it.
 * 
 * @param {String} str String to unescape
 * @returns {String} Unescaped string
 */
function Unescape(str) {
    return str.replaceAll(/\\x?([0-9]+)/g, (_, p1) => String.fromCharCode(p1))
}

export {Stringify, Hexlify, Unhexlify, CString, Unescape}
