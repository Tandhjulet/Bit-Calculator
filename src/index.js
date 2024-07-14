const submit = document.getElementById("submit");
submit.onclick = () => {
    const equation = document.getElementById("eq").value;
    const nodes = parse(new TokenStream(new InputStream(equation)));
    const evaluted = evaluate(nodes[0]);
    console.log(evaluted);
};
function parse(stream) {
    const nodes = [];
    function parseBinary(left, currPrec) {
        const currToken = stream.peek();
        if (currToken && currToken.type === "Operator" && currToken instanceof OperatorNode) {
            if (currToken.getPrecedence() > currPrec) {
                stream.next();
                const leftNode = stream.next();
                stream.peek();
                return parseBinary(new BinaryNode(currToken, 
                // both left and right must be a number/constant as adjacent operators arent supported
                left, parseBinary(leftNode, currToken.getPrecedence())), currPrec);
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
        function read(ch) {
            if (ch == ".") {
                if (hasDot)
                    return false;
                hasDot = true;
                return true;
            }
            return TokenStream.isDigit(ch);
        }
        let hasDot = false;
        let str = "";
        while (!this.input.end() && read(this.input.peek())) {
            str += this.input.next();
        }
        return new ConstantNode(hasDot ? parseFloat(str) : parseInt(str));
    }
    static isDigit(ch) {
        return /[0-9]/.test(ch);
    }
    static isOperator(ch) {
        return TokenStream.operators.includes(ch);
    }
}
TokenStream.operators = Object.keys(OperatorNode.PRECEDENCE);