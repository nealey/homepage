import {awardPoints} from "./awardPoints.mjs"

function scorecardUpdate(scorecard) {
    let scores = []
    let points = []
    let highestRank = []

    let firstRow = scorecard.querySelector("tbody tr")
    for (let input of firstRow.querySelectorAll("input")) {
        scores.push(0)
        points.push(0)
    }

    for (let row of scorecard.querySelectorAll("tbody tr")) {
        let i = 0
        for (let input of row.querySelectorAll("input")) {
            let ranking = Number(input.value)
            scores[i] += ranking
            points[i] += awardPoints[ranking]
            highestRank[i] = Math.min(highestRank[i] || 100, ranking)
            i += 1
        }
    }

    {
        let i = 0
        for (let out of scorecard.querySelectorAll("tfoot output[name='points']")) {
            out.value = points[i]
            i += 1
        }    
    }

    {
        let rankOffset = 0
        let overallRanking = []
        let rankedPoints = [...points].sort((a, b) => b - a)
        for (let i = 0; i < points.length; i++) {
            overallRanking[i] = rankedPoints.indexOf(points[i]) + 1
            if (overallRanking[i] == 1) {
                rankOffset = highestRank[i]
            }
        }

        let i = 0
        for (let out of scorecard.querySelectorAll("tfoot output[name='ranking']")) {
            out.value = rankedPoints.indexOf(points[i]) + rankOffset
            i += 1
        }
    }
}

function init() {
    for (let scorecard of document.querySelectorAll(".scorecard")) {
        for (let input of scorecard.querySelectorAll("input")) {
            input.addEventListener("input", () => scorecardUpdate(scorecard))
        }
        scorecardUpdate(scorecard)
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
} else {
    init()
}
  