class ConstantNode extends ExprNode {
    get type(): keyof typeof NodeType { return "Constant" }

    private value: number;

    constructor(value: number) {
        super();

        this.value = value;
    }

    getValue() {
        return this.value;
    }
}