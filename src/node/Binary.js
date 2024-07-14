class BinaryNode extends ExprNode {
    get type() { return "Binary"; }
    constructor(operator, left, right) {
        super();
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
}
