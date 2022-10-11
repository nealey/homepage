/** 
 * Feis Dataset Importer
 */

import * as FeisWorx from "./feisworx.mjs"
import * as FeisResults from "./feisresults.mjs"

/** 
 * @typedef {import("./types.mjs").Results} Results
 * @typedef {import("./types.mjs").Result} Result
 * @typedef {import("./types.mjs").Round} Round
 * @typedef {import("./types.mjs").Adjudication} Adjudication
 * @typedef {Array.<Array.<String>>} RawData
 */

/**
 * Creates a new element and appends it to parent
 * 
 * @param {Element} parent Element to append to
 * @param {String} type Type of element to create
 * @param {Object} [dataset] Data fields to set
 * @returns {Element}
 */
function newElement(parent, type, dataset={}) {
    let child = parent.appendChild(document.createElement(type))
    for (let k in dataset) {
        child.dataset[k] = dataset[k]
    }
    return child
}

/**
 * Load a file and parse it into Results.
 * 
 * @param {URL|String} url Location of file to load
 * @returns {Results} Parsed results
 */
async function loadData(url) {
    let resp = await fetch(url)
    let contentType = resp.headers.get("Content-Type")
    if (! contentType.includes("/xml")) {
        console.error(`Cannot load data with content-type ${contentType}`)
        return
    }
    let text = await resp.text()
    let doc = new DOMParser().parseFromString(text, "text/xml")
    let rawData = parseXMLDocument(doc)
    return parseRawData(rawData)
}

/**
 * Parse an XML document of feis results into a 2D array of strings
 * 
 * @param {Document} doc XML Document
 * @returns {RawData} Raw data
 */
function parseXMLDocument(doc) {
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
 * Parse raw data into a list of adjudicators and results
 * 
 * @param {RawData} rawData Raw data
 * @returns {Results} Parsed Results
 */
function parseRawData(rawData) {
    let firstRow = rawData[0]
    if (firstRow[0].trim().toLowerCase() == "place awd pts") {
        return FeisWorx.parse(rawData)
    } 
    if (firstRow[firstRow.length-1].trim().toLowerCase() == "total ip *") {
        return FeisResults.parse(rawData)
    }
    console.error("First row doesn't resemble anything I can cope with", firstRow)
}

/**
 * 
 * Fills a table element with some results
 * 
 * @param {Element} table Table to fill in
 * @param {Results} results Results to fill with
 */
function fillTable(table, results) {
    let head = newElement(table, "thead")
    let row0 = newElement(head, "tr")
    let row1 = newElement(head, "tr")
    let row2 = newElement(head, "tr")

    newElement(row0, "th").colSpan = 2
    newElement(row1, "th").colSpan = 2
    newElement(row2, "th").textContent = "Name"
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
        newElement(row, "th").textContent = result.overallRank

        let i = 0
        for (let round of result.rounds) {
            let first = true
            for (let adjudication of round) {
                let raw = newElement(row, "td")
                raw.textContent = adjudication.raw
                raw.classList.add("new-adjudication")
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
        let results = await loadData(div.dataset.url)
        
        let table = newElement(div, "table")
        fillTable(table, results)
    }
}


if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
} else {
    init()
}

export {
    loadData,
    parseXMLDocument,
    parseRawData,
}
