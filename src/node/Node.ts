enum NodeType {
    "Node",
    "Constant",
    "Binary",
    "Operator"
}

class ExprNode {
    get type(): keyof typeof NodeType { return "Node" }
}