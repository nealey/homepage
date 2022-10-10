/**
 * @typedef Result
 * @type {object}
 * @param {String} name Competitor's name
 * @param {Number} number Competitor's bib number
 * @param {String} school Competitor's school
 * @param {Number} overallPoints Overall award points for this competitor
 * @param {Number} overallRank Overall ranking for this competitor
 * @param {String} qualifier Any qualifiers this ranking earned
 * @param {Array.<Round>} rounds How this competitor was judged in each round
 */

/**
 * @typedef Round
 * @type {Array.<Adjudication>}
 */

/**
 * @typedef Adjudication
 * @type {object}
 * @param {String} adjudicator Adjudicator who recorded this score
 * @param {Number} raw Raw score
 * @param {Number} placing Placing relative to this adjudicator's other scores
 * @param {Number} points Award points
 */

/**
 * Creates a new element and appends it to parent
 * 
 * @param {Element} parent
 * @param {String} type
 * @returns {Element}
 */
function newElement(parent, type) {
    return parent.appendChild(document.createElement(type))
}

class Dataset {
    /**
     * 
     * @param {String} url URL to load
     */
    constructor(url) {
        if (url) {
            this.loadData(url)
        }
    }
    async loadData(url) {
        let resp = await fetch(url)
        let contentType = resp.headers.get("Content-Type")
        if (! contentType.includes("/xml")) {
            console.error(`Cannot load data with content-type ${contentType}`)
            return
        }
        let text = await resp.text()
        this.doc = new DOMParser().parseFromString(text, "text/xml")
        this.rawData = this.parseXMLDocument(this.doc)
        this.results = this.parseRawData(this.rawData)
    }

    parseXMLDocument(doc) {
        let table = doc.querySelector("Table")
        let rawData = []

        for (let dataRow of table.children) {
            if (! ["tr"].includes(dataRow.tagName.toLowerCase())) {
                console.warn(`Warning: unexpected XML tag ${dataRow.tagName}, expecting tr`)
                continue
            }

            let row = []
            for (let dataCell of dataRow.children) {
                if (! ["th", "td"].includes(dataCell.tagName.toLowerCase())) {
                    console.warn(`Warning: unexpected XML tag ${dataRow.tagName}, expecting th/td`)
                    continue
                }
                row.push(dataCell.textContent)
            }

            rawData.push(row)
        }
        return rawData
    }


    /** 
     * @typedef  ParsedData
     * @type {object}
     * @property {Array.<String>} adjudicators List of adjudicators
     * @property {Array.<Result>} results List of results
     */

    /**
     * Parse raw data into a list of adjudicators and results
     * 
     * @param {Array.<Array.<String>>} rawData Raw data
     * @returns {Array.<Result>}
     */
    parseRawData(rawData) {
        let cellA1 = rawData[0][0].trim().toLowerCase()
        switch (cellA1) {
            case "place awd pts":
                return this.parseFeisWorx2017(rawData)
        }
        console.error("Cell A1 doesn't resemble anything I can cope with", rawData[0])
    }

    /**
     * Parse FeisWorx 2017 data
     * 
     * This is the output of Adobe Reader saving the PDF as XML.
     * 
     * @param {Array.<Array.<String>>} rawData Raw data
     * @returns {Array.<Result>}
     */
    parseFeisWorx2017(rawData) {
        let adjudicators = []
        let results = []
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

            row.rounds = []
            let round = []
            for (let cellIndex = 2; cellIndex < cells.length; cellIndex++) {
                let cell = cells[cellIndex]
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
}

/**
 * 
 * Fills a table element with some results
 * 
 * @param {Element} table Table to fill in
 * @param {Array.<Result>} results Results to fill with
 */
function fillTable(table, results) {
    let head = newElement(table, "thead")
    let row0 = newElement(head, "tr")
    let row1 = newElement(head, "tr")
    let row2 = newElement(head, "tr")

    newElement(row0, "th").colSpan = 3
    newElement(row1, "th").colSpan = 3
    newElement(row2, "th").textContent = "Name"
    newElement(row2, "th").textContent = "Points"
    newElement(row2, "th").textContent = "Rank"

    let roundNumber = 0
    for (let round of results[0].rounds) {
        let roundCell = newElement(row0, "th")
        roundCell.textContent = `Round ${++roundNumber}`
        roundCell.colSpan = 3*round.length
        for (let adjudication of round) {
            let adjudicator = adjudication.adjudicator
            let cell = newElement(row1, "th")
            cell.textContent = adjudicator
            cell.colSpan = 3
        
            newElement(row2, "th").textContent = "Raw"
            newElement(row2, "th").textContent = "Placing"
            newElement(row2, "th").textContent = "Points"
        }
    }

    let body = newElement(table, "tbody")
    for (let result of results) {
        let row = newElement(body, "tr")
        
        newElement(row, "th").textContent = result.name
        newElement(row, "th").textContent = result.overallPoints
        newElement(row, "th").textContent = result.overallRank

        let i = 0
        for (let round of result.rounds) {
            let first = true
            for (let adjudication of round) {
                let raw = newElement(row, "td")
                raw.textContent = adjudication.raw
                if (first) {
                    raw.classList.add("new-round")
                    first = false
                }

                newElement(row, "td").textContent = adjudication.placing
                newElement(row, "td").textContent = adjudication.points
                i++
            }
        }
    }
}

async function init() {
    for (let div of document.querySelectorAll(".clrg-dataset")) {
        let dataset = new Dataset()
        await dataset.loadData(div.dataset.url)

        let table = newElement(div, "table")
        fillTable(table, dataset.results)
        console.log(dataset)
    }
}


if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
} else {
    init()
}

export {
    Dataset,
}
