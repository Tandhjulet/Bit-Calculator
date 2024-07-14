interface Operators {
    "+": number,
    "-": number,
    "*": number,
    "/": number,
}

class OperatorNode extends ExprNode {
    static PRECEDENCE: Operators = {
        "+": 10,
        "-": 10,
    
        "*": 20,
        "/": 20,
    }

    get type() { return "Operator" }

    private operator: keyof Operators;

    constructor(operator: string) {
        super();

        if(operator.length != 1 || !OperatorNode.PRECEDENCE[operator])
            throw {
                name: "Runtime Exception",
                message: `Operator ${operator} not supported.`
            }

        this.operator = operator as keyof Operators;
    }

    getOperator() {
        return this.operator
    }

    getPrecedence() {
        return OperatorNode.PRECEDENCE[this.operator]
    }
}