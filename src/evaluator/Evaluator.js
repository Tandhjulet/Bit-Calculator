const DEBUG = true;
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
    // TODO: actually implement the required bit manipulation
    switch (operator) {
        case "+":
            return add(a, b);
        case "-":
            break;
        case "*":
            break;
        case "/":
            break;
    }
    throw new Error("Unknown operator " + operator);
}
/**
 * Implementation of a simple <https://en.wikipedia.org/wiki/Adder_%28electronics%29#Half_adder>.
 * Addition of carry and a^b until carry becomes 0.
 * @returns Sum of the two numbers
 */
function add(x, y) {
    // if we dont have any carry x=x^y is the sum
    if (y == 0)
        return x;
    if (DEBUG) {
        console.log("---------");
        console.log("sum", x ^ y);
        console.log("carry", (x & y) << 1);
    }
    return add(
    // if x & y dont have bits in the same position, their sum
    // can be obtained through XOR (^)
    x ^ y, 
    // to incorporate common set bits aswell, let's calculate the carries.
    // this can be done through AND (&).
    (x & y) << 1);
}
