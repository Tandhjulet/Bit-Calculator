class ConstantNode extends ExprNode {
    get type() { return "Constant"; }
    constructor(value) {
        super();
        this.value = value;
    }
    getValue() {
        return this.value;
    }
}
