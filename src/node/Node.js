var NodeType;
(function (NodeType) {
    NodeType[NodeType["Node"] = 0] = "Node";
    NodeType[NodeType["Constant"] = 1] = "Constant";
    NodeType[NodeType["Binary"] = 2] = "Binary";
    NodeType[NodeType["Operator"] = 3] = "Operator";
})(NodeType || (NodeType = {}));
class ExprNode {
    get type() { return "Node"; }
}
