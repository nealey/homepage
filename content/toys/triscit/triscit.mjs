import * as Binutils from "./binutils.mjs"

const FLAG_NEGATIVE = 1 << 0
const FLAG_HALT = 1 << 1
const FLAG_ABLAZE = 1 << 2

class Instruction {
    constructor(name, args, description) {
        this.Name = name
        this.Args = args
        this.Description = description
    }
}

const Instructions = [
    new Instruction("NOOP", [], "Do nothing"),
    new Instruction("PRNT", ["x"], "Print string at x"),
    new Instruction("READ", ["x"], "Read input, store in x"),
    new Instruction("CMPS", ["x", "y"], "Compare string x to string y"),
    new Instruction("JNEQ", ["x"], "If not equal, set PC to x"),
    new Instruction("JUMP", ["x"], "Set PC to x"),
    new Instruction("HALT", [], "Terminate program"),
    new Instruction("HACF", [], "Halt And Catch Fire (never use this!)"),
]

function disassemble(program) {
    let b = program[0]
    let inst = Instructions[b]
    if (inst) {
        let nargs = inst.Args.length
        let args = []
        for (let i = 0; i < nargs; i++) {
            args.push(program[i+1])
        }

        if (1+nargs <= program.length) {
            // Only return an opcode if there was enough data for its arguments as well
            return {length: 1+nargs, name: inst.Name, args: args}
        }
    }

    let data = Binutils.CString(program, true)
    let s = Binutils.Stringify(data)
    return {length: data.length, name: "DATA", args: [s]}
}

class CPU {
    /**
     * @param {Uint8Array} program Program to load
     * @param {string} input input string
     * @param {Number} pc initial program counter
     * @param {Number} flags initial flags
     */
    constructor(program, input, output="", pc=0, flags=0) {
        this.Program = program
        this.Input = input
        this.Output = output
        this.PC = pc
        this.Flags = flags
    }

    Clone() {
        return new CPU(this.Program, this.Input, this.Output, this.PC, this.Flags)
    }

    DisassembleProgram() {
        let ret = []
        let prog1 = this.Program.slice(0, this.PC)
        let addr = 0
        for (let prog of [prog1, this.Program]) {
            while (addr < prog.length) {
                let subprog = prog.slice(addr)
                let inst = disassemble(subprog)
                ret.push({
                    addr,
                    buf: this.Program.slice(addr, addr+inst.length), 
                    name: inst.name, 
                    args: inst.args,
                })
                addr += inst.length                    
            }
        }
        return ret
    }

    Step() {
        let prog = this.Program.slice(this.PC)
        let inst = disassemble(prog)
        let flags = this.Flags
        this.Flags = 0
        switch (inst.name) {
            case "JUMP":
                this.PC = inst.args[0]
                return
            case "JNEQ":
                if (flags && FLAG_NEGATIVE) {
                    this.PC = inst.args[0]
                    return
                }
                break
            case "READ": {
                let addr = inst.args[0]
                let b = new TextEncoder().encode(this.Input + "\0")
                let newproglen = Math.max(this.Program.length, addr+b.length)
                let newprog = new Uint8Array(newproglen)

                for (let i = 0; i < addr; i++) {
                    newprog[i] = this.Program[i]
                }
                for (let i = 0; i < b.length; i++) {
                    newprog[addr+i] = b[i]
                }
                for (let i = addr+b.length; i < this.Program.length; i++) {
                    newprog[i] = this.Program[i]
                }
                this.Program = newprog
                break
            }
            case "PRNT": {
                let addr = inst.args[0]
                let prog = this.Program.slice(addr)
                this.Output = Binutils.CString(prog)
                break
            }
            case "CMPS": {
                let decoder = new TextDecoder()
                let a = decoder.decode(Binutils.CString(this.Program.slice(inst.args[0])))
                let b = decoder.decode(Binutils.CString(this.Program.slice(inst.args[1])))
                if (a != b) {
                    this.Flags = FLAG_NEGATIVE
                }
                break
            }
            case "HALT":
                // Don't modify PC
                this.Flags = FLAG_HALT
                return
            case "HACF":
                this.Flags = FLAG_HALT | FLAG_ABLAZE
                return
            case "DATA":
                // Keep stepping through data one byte at a time trying to execute something
                inst.length = 1
                break
        }
        this.PC += inst.length
    }
}

export {
    FLAG_NEGATIVE, FLAG_HALT, FLAG_ABLAZE,
    Instructions, 
    CPU,
}