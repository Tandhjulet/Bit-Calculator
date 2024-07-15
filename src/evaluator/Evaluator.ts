const DEBUG = true;

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
            return add(a, b)
        case "-":
            return subtract(a, b)
        case "*":
            return multiply(a, b)
        case "/":
            return divide(a, b)
    }
    throw new Error("Unknown operator " + operator)
}

/**
 * Implementation of a simple <https://en.wikipedia.org/wiki/Adder_%28electronics%29#Half_adder>.  
 * Addition of carry and a^b until carry becomes 0.
 * @returns Sum of the two numbers
 */
function add(x: number, y: number) {
    // if we dont have any carry x=x^y is the sum
    if(y == 0)
        return x;

    if(DEBUG) {
        console.log("---------")
        console.log("sum", (x ^ y).toString())
        console.log("carry", ((x & y) << 1).toString())
    }
    
    return add(
        // if x & y dont have bits in the same position, their sum
        // can be obtained through XOR (^)
        x ^ y,

        // to incorporate common set bits aswell, let's calculate the carries.
        // this can be done through AND (&).
        (x & y) << 1
    )
}

/**
 * Implementation of a simple <https://en.wikipedia.org/wiki/Subtractor#Half_subtractor>.  
 * Addition of carry and a^b until carry becomes 0.
 * @returns Difference between two numbers
 */
function subtract(x: number, y: number) {
    // The same idea as with addition can be applied here.
    // x - y is x^y and the borrow becomes ~x & y << 1 as displayed in the truth table below

    // x | y | x - y | borrow
    // ----------------------
    // 1 | 1 |   0   |   0
    // 1 | 0 |   1   |   0
    // 0 | 0 |   0   |   0
    // 0 | 1 |   1   |   1

    if(y == 0)
        return x;

    if(DEBUG) {
        console.log("---------")
        console.log("sum", (x ^ y).toString(2))
        console.log("borrow", ((~x & y) << 1).toString(2))
    }
    
    return subtract(
        // if x & y dont have bits in the same position, their sum
        // can be obtained through XOR (^)
        x ^ y,
        (~x & y) << 1
    )
}

function multiply(a: number, b: number) {
    return a * b;
}

function divide(a: number, b: number) {
    return a / b;
}