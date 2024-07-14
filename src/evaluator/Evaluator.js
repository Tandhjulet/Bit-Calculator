function evaluate(node) {
    switch (node.type) {
        case "Binary":
            const binaryNode = node;
            return applyOperator(binaryNode.operator.getOperator(), evaluate(binaryNode.left), evaluate(binaryNode.right));
        case "Constant":
            return node.getValue();
        default:
            throw new Error("Unable to evaluate " + node.type);
    }
}
function applyOperator(operator, a, b) {
    switch (operator) {
        case "+":
            break;
        case "-":
            break;
        case "*":
            break;
        case "/":
            break;
    }
    return a + b;
}
