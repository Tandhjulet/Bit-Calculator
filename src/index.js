function handleClick(e) {
    const eqElement = document.getElementById("eq");
    if (e.value === "=") {
        try {
            const nodes = parse(new TokenStream(new InputStream(eqElement.value)));
            const evaluated = evaluate(nodes[0]);
            const el = document.getElementById("pastEq");
            el.style.color = null;
            el.innerText = eqElement.value + "=" + evaluated;
            eqElement.value = "";
        }
        catch (err) {
            const el = document.getElementById("pastEq");
            el.innerText = err;
            el.style.color = "red";
        }
        return;
    }
    eqElement.value += e.value;
}
function parse(stream) {
    const nodes = [];
    function parseBinary(left, currPrec) {
        const currToken = stream.peek();
        if (currToken && currToken.type === "Operator" && currToken instanceof OperatorNode) {
            if (currToken.getPrecedence() > currPrec) {
                stream.next();
                const rightNode = stream.next();
                stream.peek();
                return parseBinary(new BinaryNode(currToken, 
                // both left and right must be a number/constant as adjacent operators arent supported
                left, parseBinary(rightNode, currToken.getPrecedence())), currPrec);
            }
        }
        return left;
    }
    while (!stream.eof()) {
        const next = stream.next();
        nodes.push(parseBinary(next, 0));
    }
    return nodes;
}
class InputStream {
    constructor(input) {
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
        return this.peek() === "";
    }
}
class TokenStream {
    constructor(input) {
        this.input = input;
    }
    next() {
        const token = this.current;
        this.current = null;
        return token || this.readNext();
    }
    peek() {
        return this.current || (this.current = this.readNext());
    }
    eof() {
        return this.peek() == null;
    }
    readNext() {
        if (this.input.end()) {
            return null;
        }
        ;
        const ch = this.input.peek();
        if (TokenStream.isDigit(ch)) {
            return this.readNumber();
        }
        else if (TokenStream.isOperator(ch)) {
            this.input.next();
            return new OperatorNode(ch);
        }
        throw new Error("Unsupported char " + ch);
    }
    readNumber() {
        let str = "";
        while (!this.input.end() && TokenStream.isDigit(this.input.peek())) {
            str += this.input.next();
        }
        return new ConstantNode(parseInt(str));
    }
    static isDigit(ch) {
        return /[0-9]/.test(ch);
    }
    static isOperator(ch) {
        return TokenStream.operators.includes(ch);
    }
}
TokenStream.operators = Object.keys(OperatorNode.PRECEDENCE);
