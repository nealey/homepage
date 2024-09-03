import * as Binutils from "./binutils.mjs"
import * as Triscit from "./triscit.mjs"

const SamplePrograms = [
    `05 0d 
61 62 63 64 65 66 67 68 69 6a 00 
02 02 
01 02 
06
`,
    `05 31
61 62 63 64 65 66 67 68 69 6a 00
70 61 73 73 77 6f 72 64 00
53 75 70 65 72 20 53 65 63 72 65 74 00
53 6f 72 72 79 2c 20 77 72 6f 6e 67 2e 00
02 02
03 02 0d
04 3b
01 16
06
01 23
06
`
]

function fill(element, values) {
    for (let e of element.querySelectorAll("[data-fill]")) {
        e.textContent = values[e.dataset.fill]
    }
}

class UI {
    constructor(program=[]) {
        this.program = program
        this.Init()
        this.Reset()
    }

    Init() {
        for (let e of document.querySelectorAll("[data-control]")) {
            switch (e.dataset.control) {
            case "step":
                e.addEventListener("click", () => this.Step())
                break
            case "back":
                e.addEventListener("click", () => this.Unstep())
                break
            case "reset":
                e.addEventListener("click", () => this.Reset())
                break
            case "input":
                e.addEventListener("input", () => this.SetInput())
                break
            case "0xinput":
                e.addEventListener("input", () => this.SetInput(true))
                break
            case "program":
                e.addEventListener("input", () => this.SetProgram())
            }
        }

        let ih = document.querySelector("#instructions-help")
        for (let i = 0; i < Triscit.Instructions.length; i++) {
            let inst = Triscit.Instructions[i]
            let doc = document.querySelector("template#instruction-help").content.cloneNode(true)
            let tr = doc.firstElementChild
            fill(tr, {
                num: Binutils.Hexlify([i]),
                args: inst.Args.join(" "),
                name: inst.Name,
                description: inst.Description,
            })
            ih.appendChild(doc)
        }

        let fields = new URLSearchParams(window.location.search);
        let progNumber = fields.get("p") || 0
        let progElement = document.querySelector('[data-control="program"]')
        let prog = SamplePrograms[progNumber]
        if (prog) {
            progElement.value = SamplePrograms[progNumber]
            progElement.parentElement.classList.add("is-hidden")
        }

        this.SetInput()
        this.SetProgram()
    }

    Reset() {
        this.cpu = new Triscit.CPU(this.program, this.input)
        this.stack = []
        this.Refresh()
    }

    Refresh() {
        let inste = document.querySelector("#instructions")
        while (inste.firstChild) inste.firstChild.remove()
        for (let i of this.cpu.DisassembleProgram()) {
            let doc = document.querySelector("template#instruction").content.cloneNode(true)
            let tr = doc.firstElementChild
            fill(tr, {
                addr: Binutils.Hexlify([i.addr]),
                name: i.name,
                hex: Binutils.Hexlify(i.buf),
            })
            
            let args = tr.querySelector(".args")
            for (let a of i.args) {
                if (! isNaN(a)) {
                    a = Binutils.Hexlify([a])
                }
                args.textContent += `${a} `
            }

            inste.appendChild(tr)
            if (i.addr == this.cpu.PC) {
                tr.classList.add("is-selected")
                tr.scrollIntoView(false)
                // let top = tr.offsetTop
                // let parent = tr.parentElement

                // tr.parentElement.scrollTop = top
            }
        }

        for (let e of document.querySelectorAll("[data-flag]")) {
            let mask = 0
            let className = "is-info"
            switch (e.dataset.flag) {
            case "negative":
                mask = Triscit.FLAG_NEGATIVE
                break
            case "halt":
                mask = Triscit.FLAG_HALT
                break
            case "fire":
                mask = Triscit.FLAG_ABLAZE
                className = "is-danger"
                break
            }
            if (this.cpu.Flags & mask) {
                e.classList.add(className)
            } else {
                e.classList.remove(className)
            }
        }

        for (let cpuBox of document.querySelectorAll("#cpu-box")) {
            if (this.cpu.Flags & Triscit.FLAG_ABLAZE) {
                cpuBox.classList.add("ablaze")
            } else {
                cpuBox.classList.remove("ablaze")
            }
        }

        for (let e of document.querySelectorAll("[data-value]")) {
            switch (e.dataset.value) {
            case "pc":
                e.textContent = Binutils.Hexlify([this.cpu.PC])
                break
            case "output":
                e.textContent = Binutils.Stringify(this.cpu.Output)
                break
            }
        }
    }

    Step() {
        if (this.cpu.Flags & Triscit.FLAG_HALT) {
            return
        }
        this.stack.push(this.cpu)
        this.cpu = this.cpu.Clone()
        this.cpu.Step()
        this.Refresh()
    }

    Unstep() {
        if (this.stack.length == 0) {
            return
        }
        this.cpu = this.stack.pop()
        this.Refresh()
    }

    SetProgram() {
        let e =document.querySelector('[data-control="program"]')
        this.program = Binutils.Unhexlify(e.value || "")
        this.Reset()
    }

    Set0xInput() {
        let e = document.querySelector('[data-control="0xinput"]')
        let x = e.value || ""
        let v = Binutils.Unhexlify(x)
        // XXX: escape v and fill into the input
        this.input = Binutils.Unhexlify(v)
        this.Reset()
    }
    SetInput() {
        let e = document.querySelector('[data-control="input"]')
        let v = e.value || ""
        let x = Binutils.Hexlify(v)
        this.input = Binutils.Unescape(v)
        this.Reset()
    }
}

function init() {
    let app = new UI()
    window.app = app
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
} else {
    init()
}
