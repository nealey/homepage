const FruitNumerals = [
    "", "🍏", "🍏🍏", "🍏🍏🍏", "🍏🍏🍏🍏",
    "🍊", "🍊🍏", "🍊🍏🍏", "🍊🍏🍏🍏", "🍊🍏🍏🍏🍏",
    "🍊🍊", "🍊🍊🍏", "🍊🍊🍏🍏", "🍊🍊🍏🍏🍏", "🍊🍊🍏🍏🍏🍏",
    "🍊🍊🍊", "🍊🍊🍊🍏", "🍊🍊🍊🍏🍏", "🍊🍊🍊🍏🍏🍏", "🍊🍊🍊🍏🍏🍏🍏",
]

const KaktovikNumerals = [
    "𝋀", "𝋁", "𝋂", "𝋃", "𝋄", 
    "𝋅", "𝋆", "𝋇", "𝋈", "𝋉", 
    "𝋊", "𝋋", "𝋌", "𝋍", "𝋎", 
    "𝋏", "𝋐", "𝋑", "𝋒", "𝋓",
]

function ToNumerals(numerals, n) {
    let base = numerals.length
    let its = []
    if (n < base) {
        return [numerals[n]]
    }
    while (n > 0) {
        its.unshift(numerals[n % base])
        n = Math.floor(n / base)
    }
    return its
}

function ToFruit(n) {
    let its = ToNumerals(FruitNumerals, n)
    let doc = new DocumentFragment()
    for (let it of its) {
        let row = doc.appendChild(document.createElement("div"))
        row.classList.add("row")
        row.textContent = it
    }
    return doc
}

function ToKaktovik(n) {
    let its = ToNumerals(KaktovikNumerals, n)
    return its.join("")
}

function ToApples(n) {
    let doc = new DocumentFragment()
    while (n > 0) {
        let apples = Math.min(n, 5)
        let row = doc.appendChild(document.createElement("div"))
        row.classList.add("row")
        row.textContent = "🍏".repeat(apples)
        n -= apples
    }
    return doc
}


class Counter {
    /**
     * Initialize a counter element.
     * 
     * This makes buttons active,
     * and does an initial render.
     * 
     * @param {HTMLElement} element 
     */
    constructor(element, n=1) {
        this.element = element
        this.n = n
        this.min = Number(this.element.dataset.min) || 0
        this.max = Number(this.element.dataset.max) || Infinity

        for (let e of this.element.querySelectorAll("button.add")) {
            let amount = Number(e.dataset.amount) || 1
            e.addEventListener("click", e => this.add(e, amount))
        }
        this.render()
    }

    add(event, amount) {
        let n = this.n + amount
        n = Math.min(n, this.max)
        n = Math.max(n, this.min)
        if (n != this.n) {
            this.n = n
            this.render()
        }
    }

    render() {
        for (let e of this.element.querySelectorAll(".kaktovik")) {
            e.textContent = ToKaktovik(this.n)
        }
        for (let e of this.element.querySelectorAll(".fruit")) {
            while (e.firstChild) e.firstChild.remove()
            e.appendChild(ToFruit(this.n))
        }
        for (let e of this.element.querySelectorAll(".apples")) {
            while (e.firstChild) e.firstChild.remove()
            e.appendChild(ToApples(this.n))
        }
        for (let e of this.element.querySelectorAll(".arabic")) {
            e.textContent = this.n
        }
    }
}

function init() {
    for (let e of document.querySelectorAll(".counter")) {
        new Counter(e)
    }
}

document.addEventListener("DOMContentLoaded", init)
