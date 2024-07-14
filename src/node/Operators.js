class OperatorNode extends ExprNode {
    get type() { return "Operator"; }
    constructor(operator) {
        super();
        if (operator.length != 1 || !OperatorNode.PRECEDENCE[operator])
            throw {
                name: "Runtime Exception",
                message: `Operator ${operator} not supported.`
            };
        this.operator = operator;
    }
    getOperator() {
        return this.operator;
    }
    getPrecedence() {
        return OperatorNode.PRECEDENCE[this.operator];
    }
}
OperatorNode.PRECEDENCE = {
    "+": 10,
    "-": 10,
    "*": 20,
    "/": 20,
};
