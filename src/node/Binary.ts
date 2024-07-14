class BinaryNode extends ExprNode {
    get type() { return "Binary" }

    operator: OperatorNode;
    left: ConstantNode;
    right: ConstantNode;

    constructor(
        operator: OperatorNode,
        left: ConstantNode,
        right: ConstantNode
    ) {
        super();

        this.operator = operator;
        this.left = left;
        this.right = right;
    }
}