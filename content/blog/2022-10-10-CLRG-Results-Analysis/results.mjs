class Results {
    /**
     * 
     * @param {string} url URL to load
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
        this.data = this.parseRawData(this.rawData)
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

    parseRawData(rawData) {
        let cellA1 = rawData[0][0].trim().toLowerCase()
        switch (cellA1) {
            case "place awd pts":
                return this.parseFeisWorx2017(rawData)
                break
        }
        console.error("Cell A1 doesn't resemble anything I can cope with", rawData[0])
    }

    /**
     * 
     * @param {Array.<Array.<string>>} rawData 
     */
    parseFeisWorx2017(rawData) {
        let adjudicators = []
        let data = []
        for (let rowIndex = 0; rowIndex < rawData.length; rowIndex++) {
            let cells = rawData[rowIndex]
            switch (rowIndex) {
                case 0: // Column headers
                    break
                case 1: // Adjudicators
                    adjudicators = cells
                    break
                default:
                    if ((cells.length == 11) && (cells[0].trim().toLowerCase().startsWith("place"))) {
                        // Page heading
                        continue
                    }
                    
                    if (cells.length >= adjudicators.length) {
                        // Is this just a list of adjudicators again?
                        let lenDiff = cells.length - adjudicators.length
                        let same = true
                        for (let i = adjudicators.length-1; i >= 0; i--) {
                            if (adjudicators[i] != cells[i+lenDiff]) {
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
                        let parts = cells[1].trim().split(/ - /)
                        row.competitorNumber = Number(parts[0])
                        row.competitorName = parts[1]
                        row.qualifier = parts[2]
                    }

                    row.adjudication = {} // XXX: I don't like this name
                    for (let cellIndex = 2; cellIndex < cells.length; cellIndex++) {
                        let cell = cells[cellIndex]
                        let vote = {}
                        let parts = cell.trim().split(/ - ?|\s/)

                        if ((parts.length == 5) && (parts[3] == "AP")) {
                            parts.splice(3, 0, "NaN")
                        }

                        if ((parts.length == 7) && (parts[4] == "T")) {
                            vote.tie = true
                            parts.splice(4, 1)
                        } else {
                            vote.tie = false
                        }

                        if (parts.length != 6) {
                            console.error(`Wrong number of fields in row ${rowIndex} cell ${cellIndex}:`, parts, cells)
                        } else {
                            for (let i = 0; i < parts.length; i += 2) {
                                let key = parts[i]
                                let val = Number(parts[i+1])
                                switch (key) {
                                    case "Raw":
                                        vote.raw = val
                                        break
                                    case "Plc":
                                        vote.placing = val
                                        break
                                    case "AP":
                                        vote.points = val
                                        break
                                    default:
                                        console.error(`Unknown key ${key} in row ${rowIndex} cell ${cellIndex}:`, cell)
                                        break
                                }
                            }
                            
                            let adjudicator = adjudicators[cellIndex - 2]
                            row.adjudication[adjudicator] = vote
                        }
                    }
                    data.push(row)
                    break
            }
        }
        return data
    }
}


async function init() {
    for (let div of document.querySelectorAll(".crlg-dataset")) {
        let results = new Results()
        await results.loadData(div.dataset.url)
        console.log(results.data)
    }
}


if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
} else {
    init()
}

export {
    Results,
}