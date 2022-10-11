/**
 * Feisresults.com parser
 * 
 */

import {awardPoints, guessPlacing} from "./awardPoints.mjs"

/**
 * @typedef {import("./types.mjs").Results} Results
 * @typedef {import("./types.mjs").Result} Result
 * @typedef {import("./types.mjs").Round} Round
 * @typedef {import("./types.mjs").Adjudication} Adjudication
 */


/**
 * Parse feisresults data
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

   let possibleTiesByAdjudicatorRound = {}

   for (let rowIndex = 0; rowIndex < rawData.length; rowIndex++) {
      let cells = rawData[rowIndex]

      // Is it a page heading?
      if ((cells[0].trim().toLowerCase() == "card")) {
         continue
      }

      // Is it a list of adjudicators?
      if (cells[cells.length-1].trim().toLowerCase() == "total ip *") {
         cells.splice(cells.length-1, 1) // -1: total IP *
         cells.splice(0, 5) // 0 - 4: blank
         adjudicators = []
         for (let cell of cells) {
            cell = cell.trim()
            if (cell.toLowerCase().includes("rounds 1")) {
               // skip it
            } else if (cell.toLowerCase().includes("round total")) {
               numRounds++
            } else {
               adjudicators.push(cell)
            }
         }
         adjudicatorsPerRound = adjudicators.length / numRounds
         if (! Number.isSafeInteger(adjudicatorsPerRound)) {
               console.error(`Irrational number of adjudicators for number of rounds: (${adjudicators.length}/${numRounds})`)
         }
         continue
      }

      let row = {}
      row.number = Number(cells[0])
      // cells[1]: Position at recall
      row.overallRank = Number(cells[2])
      {
         let parts = cells[3].trim().split(/\s:\s/)
         console.log(parts, cells[3])
         let nameSchool = parts[0]
         // parts[1]: region
         // We're going to take a wild-ass guess here that the dancer only has two names
         let subparts = nameSchool.split(/\s+/)
         row.name = subparts.slice(0, 2).join(" ")
         row.school = subparts.slice(2).join(" ")
      }
      row.qualifier = cells[4].trim()

      /** @type {Round} */
      let round = []
      /** @type {Array.<Round>} */
      row.rounds = []
      let adjudicatorNumber = 0
      for (let cellIndex = 5; cellIndex < cells.length; cellIndex++) {
         let cell = cells[cellIndex].trim()
         if (! cell.includes("/")) {
            continue
         }

         /** @type {Adjudication} */
         let adjudication = {} 
         adjudication.adjudicator = adjudicators[adjudicatorNumber++]

         let parts = cell.split("/")
         adjudication.raw = Number(parts[0])
         adjudication.points = Number(parts[1])
         adjudication.placing = guessPlacing(adjudication.points)
         // Guidebook reports don't list every dancer: we'll guess placing later

         round.push(adjudication)
         if (round.length == adjudicatorsPerRound) {
               row.rounds.push(round)
               round = []
         }
      }
      results.push(row)
   }

   disambiguatePlacings(results, numRounds, adjudicatorsPerRound)
   return results
}

function disambiguatePlacings(results, numRounds, adjudicatorsPerRound) {
   for (let roundNumber = 0; roundNumber < numRounds; roundNumber++) {
      /**
       * A list of raw score, award points, and placing
       * 
       * @type {Array.<Adjudication>}
       */
      for (let judgeNumber = 0; judgeNumber < adjudicatorsPerRound; judgeNumber++) {
         let scores = []
         for (let result of results) {
            scores.push(result.rounds[roundNumber][judgeNumber])
         }
         scores.sort((a,b) => b.raw - a.raw)

         let greatestPlacing = 0
         for (let adjudication of scores) {
            let possibilities = guessPlacing(adjudication.points)
            possibilities.sort((a,b) => b-a)
            // XXX: eliminate possibilities less than greatestPlacing, then pick the largest
         }
         console.log(scores)
      }
   }
 }

 export {
    parse,
 }
 