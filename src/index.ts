const submit = document.getElementById("submit");

submit.onclick = () => {
    const equation = (document.getElementById("eq") as HTMLInputElement).value;
    const nodes = parse(new TokenStream(new InputStream(equation)));

    const evaluted = evaluate(nodes[0]);

    console.log(evaluted);
}

function parse(stream: TokenStream) {
    const nodes: ExprNode[] = []
    function parseBinary(left: ExprNode, currPrec: number) {
        const currToken = stream.peek()
        if(currToken && currToken.type === "Operator" && currToken instanceof OperatorNode) {
            if(currToken.getPrecedence() > currPrec) {
                stream.next();
                const leftNode = stream.next();
                stream.peek();

                return parseBinary(
                    new BinaryNode(
                        currToken,

                        // both left and right must be a number/constant as adjacent operators arent supported
                        left as ConstantNode,
                        parseBinary(leftNode, currToken.getPrecedence()) as ConstantNode
                    ),
                currPrec)
            }
        }
        return left;
    }

    while(!stream.eof()) {
        const next = stream.next()
        nodes.push(parseBinary(next, 0))
    }

    return nodes;
}

class InputStream {
    input: string;
    pos: number;

    constructor(input: string) {
        this.input = input;
        this.pos = 0;
    }

    next() {
        const next = this.input.charAt(this.pos++);
        return next;
    }

    peek() {
        const peek = this.input.charAt(this.pos);
        return peek;
    }

    end() {
        return this.peek() === ""
    }
}

class TokenStream {
    current: ExprNode;
    input: InputStream;

    constructor(input: InputStream) {
        this.input = input;
    }

    next() {
        const token = this.current;
        this.current = null;
        return token || this.readNext();
    }

    peek() {
        return this.current || (this.current = this.readNext())
    }

    eof() {
        return this.peek() == null;
    }

    private readNext(): ExprNode {
        if(this.input.end()) {
            return null;
        };
        const ch = this.input.peek();

        if(TokenStream.isDigit(ch)) {
            return this.readNumber();
        }
        else if(TokenStream.isOperator(ch)) {
            this.input.next();
            return new OperatorNode(ch)
        }

        throw new Error("Unsupported char " + ch);
    }

    private readNumber() {
        function read(ch: string): boolean {
            if(ch == ".") {
                if(hasDot) return false;
                hasDot = true 
                return true;
            }
            return TokenStream.isDigit(ch);
        }

        let hasDot = false;

        let str = "";
        while(!this.input.end() && read(this.input.peek())) {
            str += this.input.next();
        }

        return new ConstantNode(hasDot ? parseFloat(str) : parseInt(str));
    }

    private static isDigit(ch: string) {
        return /[0-9]/.test(ch)
    }

    private static operators = Object.keys(OperatorNode.PRECEDENCE)
    private static isOperator(ch: string) {
        return TokenStream.operators.includes(ch)
    }
}