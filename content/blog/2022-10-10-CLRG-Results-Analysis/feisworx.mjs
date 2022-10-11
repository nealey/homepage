/**
 * FeisWorx parser
 * 
 * This is the output of Adobe Reader saving the PDF as XML.
 */

/**
 * @typedef {import("./types.mjs").Results} Results
 * @typedef {import("./types.mjs").Result} Result
 * @typedef {import("./types.mjs").Round} Round
 * @typedef {import("./types.mjs").Adjudication} Adjudication
 */

/**
 * Parse FeisWorx data
 * 
 * @param {Array.<Array.<String>>} rawData Raw data
 * @returns {Results}
 */
function parse(rawData) {
    /** @type {Results} */
    let results = []
    let adjudicators = []
    let numRounds = 0
    let adjudicatorsPerRound = 0

    for (let rowIndex = 0; rowIndex < rawData.length; rowIndex++) {
        let cells = rawData[rowIndex]
        
        // Is it a page heading?
        if ((cells.length >= 11) && (cells[0].trim().toLowerCase().startsWith("place"))) {
            if (numRounds == 0) {
                for (let cell of cells) {
                    if (cell.toLowerCase().startsWith("round")) {
                        numRounds++
                    }
                }
            }
            continue
        }

        if (adjudicators.length == 0) {
            let fishy = false
            for (let adjudicator of cells) {
                if (Number(adjudicator) > 0) {
                    fishy = true
                }
                adjudicators.push(adjudicator.trim())
            }
            if (fishy) {
                console.warn("Adjudicators row doesn't look right", cells)
            }
            adjudicatorsPerRound = adjudicators.length / numRounds
            if (! Number.isSafeInteger(adjudicatorsPerRound)) {
                console.error(`Irrational number of adjudicators for number of rounds: (${adjudicators.length}/${numRounds})`)
            }
            continue
        }

        // Is this just a list of adjudicators again?
        if (cells.length >= adjudicators.length) {
            let lenDiff = cells.length - adjudicators.length
            let same = true
            for (let i = adjudicators.length-1; i >= 0; i--) {
                if (adjudicators[i] != cells[i+lenDiff].trim()) {
                    same = false
                    break
                }
            }
            if (same) {
                continue
            }
        }

        let row = {}

        {
            let parts = cells[0].trim().split(/\s+/)
            row.overallRank = Number(parts[0])
            row.overallPoints = Number(parts[1])
        }

        {
            let match = cells[1].trim().match(/(\d+) - (.+) \((.+) *\)[ -]*(.+)?/)
            if (match) {
                row.number = Number(match[1])
                row.name = match[2]
                row.school = match[3]
                row.qualifier = match[4]
            }
        }

        /** @type {Round} */
        let round = []
        /** @type {Array.<Round>} */
        row.rounds = []
        for (let cellIndex = 2; cellIndex < cells.length; cellIndex++) {
            let cell = cells[cellIndex]
            /** @type {Adjudication} */
            let adjudication = {} 
            let parts = cell.trim().split(/ - ?|\s/)

            adjudication.adjudicator = adjudicators[cellIndex - 2]

            if ((parts.length == 5) && (parts[3] == "AP")) {
                parts.splice(3, 0, "NaN")
            }

            if ((parts.length == 7) && (parts[4] == "T")) {
                adjudication.tie = true
                parts.splice(4, 1)
            } else {
                adjudication.tie = false
            }

            if (parts.length != 6) {
                console.error(`Wrong number of fields in row ${rowIndex} cell ${cellIndex}:`, parts, cells)
                break
            }

            for (let i = 0; i < parts.length; i += 2) {
                let key = parts[i]
                let val = Number(parts[i+1])
                switch (key) {
                case "Raw":
                    adjudication.raw = val
                    break
                case "Plc":
                    adjudication.placing = val
                    break
                case "AP":
                    adjudication.points = val
                    break
                default:
                    console.error(`Unknown key ${key} in row ${rowIndex} cell ${cellIndex}:`, cell)
                    break
                }
            }

            round.push(adjudication)
            if (round.length == adjudicatorsPerRound) {
                row.rounds.push(round)
                round = []
            }
        }
        results.push(row)
    }
    return results
}

export {
    parse
}
