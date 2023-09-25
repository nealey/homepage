import { awardPoints } from "./awardPoints.mjs"

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}
function awardPossibilities(total=0, depth=1) {
    if (depth == 1) {
        if (awardPoints.includes(total)) {
            return [[total]]
        } else {
            return []
        }
    }

    let possibilities = []
    for (let p of awardPoints) {
        if (p <= total) {
            for (let subPossibility of awardPossibilities(total - p, depth - 1)) {
                let v = [p].concat(subPossibility)
                v.sort((a,b) => b-a)
                possibilities.push(v)
            }
        }
    }

    possibilities.sort((a,b) => b.reduce((a,b) => a*100+b) - a.reduce((a,b) => a*100+b))
    let uniquePossibilities = []
    for (let p of possibilities) {
        if (uniquePossibilities.length == 0 || !arraysEqual(p, uniquePossibilities[uniquePossibilities.length - 1])) {
            uniquePossibilities.push(p)
        }
    }
    return uniquePossibilities
}

function speculate(calc) {
    let points = calc.querySelector("[name=points]").value || 0
    let adjudicators = calc.querySelector("[name=adjudicators]").value || 3
    let results = calc.querySelector(".results tbody")
    while (results.firstChild) {
        results.removeChild(results.firstChild)
    }

    for (let warning of calc.querySelectorAll(".warning")) {
        if (adjudicators >3) {
            warning.classList.add("visible")
            setTimeout(() => asyncSpeculate(calc, points, adjudicators), 0)
        } else {
            warning.classList.remove("visible")
            asyncSpeculate(calc, points, adjudicators)
        }
    }

}

async function asyncSpeculate(calc, points, adjudicators) {
    let results = calc.querySelector(".results tbody")
    let possibilites = awardPossibilities(points, adjudicators)

    if (possibilites.length == 0) {
        let row = results.appendChild(document.createElement("tr"))
        let cell = row.appendChild(document.createElement("th"))
        cell.textContent = "No possible combinations"
    } else {
        let row = results.appendChild(document.createElement("tr"))
        for (let i = 1; i <= adjudicators; ++i) {
            let cell = row.appendChild(document.createElement("th"))
            cell.textContent = "Adj. " + i
        }
        for (let possibility of possibilites) {
            let row = results.appendChild(document.createElement("tr"))
            for (let p of possibility) {
                let cell = row.appendChild(document.createElement("td"))
                cell.textContent = p
            }
        }
    }
    for (let warning of calc.querySelectorAll(".warning")) {
        warning.classList.remove("visible")
    }
}

function init() {
    for (let calc of document.querySelectorAll(".speculator")) {
        for (let input of calc.querySelectorAll("input")) {
            input.addEventListener("input", () => speculate(calc))
        }
        speculate(calc)
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
} else {
    init()
}
  