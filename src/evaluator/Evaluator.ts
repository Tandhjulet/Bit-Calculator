function evaluate(node: ExprNode) {
    switch(node.type) {
        case "Binary":
            const binaryNode = (node as BinaryNode)
            return applyOperator(
                binaryNode.operator.getOperator(),
                evaluate(binaryNode.left),
                evaluate(binaryNode.right))
        case "Constant":
            return (node as ConstantNode).getValue();
        default: 
            throw new Error("Unable to evaluate " + node.type)
    }
}

function applyOperator(operator: keyof Operators, a: number, b: number): number {
    // TODO: actually implement the required bit manipulation
    switch(operator) {
        case "+":
            break;
        case "-":
            break;
        case "*":
            break;
        case "/":
            break;
    }
    throw new Error("Unknown operator " + operator)
}