class ConstantNode extends ExprNode {
    get type() { return "Constant" }

    private value: number;

    constructor(value: number) {
        super();

        this.value = value;
    }

    getValue() {
        return this.value;
    }
}