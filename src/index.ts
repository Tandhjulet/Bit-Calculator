function handleClick(e: HTMLInputElement) {
    const eqElement = (document.getElementById("eq") as HTMLInputElement);

    if(e.value === "=") {
        try {
            const nodes = parse(new TokenStream(new InputStream(eqElement.value)));

            const evaluated = evaluate(nodes[0]);
            const el = document.getElementById("pastEq");
            el.style.color = null;
            el.innerText = eqElement.value + "=" + evaluated;
            
            eqElement.value = "";
        } catch(err) {
            const el = document.getElementById("pastEq");
            el.innerText = err;
            el.style.color = "red"
        }
        return;
    }
    eqElement.value += e.value;
}

function parse(stream: TokenStream) {
    const nodes: ExprNode[] = []
    function parseBinary(left: ExprNode, currPrec: number) {
        const currToken = stream.peek()
        if(currToken && currToken.type === "Operator" && currToken instanceof OperatorNode) {
            if(currToken.getPrecedence() > currPrec) {
                stream.next();
                const rightNode = stream.next();
                stream.peek();

                return parseBinary(
                    new BinaryNode(
                        currToken,

                        // both left and right must be a number/constant as adjacent operators arent supported
                        left as ConstantNode,
                        parseBinary(rightNode, currToken.getPrecedence()) as ConstantNode
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
        let str = "";
        while(!this.input.end() && TokenStream.isDigit(this.input.peek())) {
            str += this.input.next();
        }

        return new ConstantNode(parseInt(str));
    }

    private static isDigit(ch: string) {
        return /[0-9]/.test(ch)
    }

    private static operators = Object.keys(OperatorNode.PRECEDENCE)
    private static isOperator(ch: string) {
        return TokenStream.operators.includes(ch)
    }
}