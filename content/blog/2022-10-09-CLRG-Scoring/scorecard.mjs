import {awardPoints} from "./awardPoints.mjs"

function scorecardUpdate(scorecard) {
    let scores = []
    let points = []

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
        let i = 0
        for (let out of scorecard.querySelectorAll("tfoot output[name='ranking']")) {
            out.value = scores[i]
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
  