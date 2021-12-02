namespace Lab3 {
  export type AST = NumLeaf | PlusNode | NegateNode;

  export class NumLeaf {
    readonly value: number;

    constructor(value: number) {
      this.value = value;
    }
  }

  export class PlusNode {
    readonly leftSubtree: AST;
    readonly rightSubtree: AST;

    constructor(leftSubtree: AST, rightSubtree: AST) {
      this.leftSubtree = leftSubtree;
      this.rightSubtree = rightSubtree;
    }
  }

  export class NegateNode {
    readonly subtree: AST;

    constructor(subtree: AST) {
      this.subtree = subtree;
    }
  }

  export function interpret(tree: AST): number {
    if (tree instanceof PlusNode)
      return interpret(tree.leftSubtree) + interpret(tree.rightSubtree);
    else if (tree instanceof NegateNode)
      return - interpret(tree.subtree);
    else
      return tree.value;
  }

  export function astToString(tree: AST): string {
    if (tree instanceof NumLeaf)
      return tree.value.toString();
    else if (tree instanceof PlusNode)
      return "(" + astToString(tree.leftSubtree) + " + " + astToString(tree.rightSubtree) + ")"
    else
      return "(- " + astToString(tree.subtree) + ")";
  }

  export function nodeCount(tree: AST): number {
    if (tree instanceof NumLeaf)
      return 1;
    else if (tree instanceof NegateNode)
      return 1 + nodeCount(tree.subtree);
    else
      return 1 + nodeCount(tree.leftSubtree) + nodeCount(tree.rightSubtree);
  }

  export function leafCount(tree: AST): number {
    if (tree instanceof NumLeaf) {
      return 1;
    }
    else if (tree instanceof NegateNode) {
      return leafCount(tree.subtree);
    }
    else {
      return leafCount(tree.leftSubtree) + leafCount(tree.rightSubtree);
    }
  }

  export function maxNum(tree: AST): number {
    if (tree instanceof NumLeaf) {
      return tree.value;
    }
    else if (tree instanceof NegateNode) {
      return maxNum(tree.subtree);
    }
    else {
      return maxNum(tree.rightSubtree);
    }
  }

  export function doubleAllLeaves(tree: AST): AST {
    if (tree instanceof NumLeaf) {
      return new NumLeaf(tree.value * 2);
    }
    else if (tree instanceof NegateNode) {
      return new NegateNode(doubleAllLeaves(tree.subtree));
    }
    else {
      return new PlusNode(doubleAllLeaves(tree.leftSubtree), doubleAllLeaves(tree.rightSubtree));
    }
  }

  export function removeAllNegations(tree: AST): AST {
    if(tree instanceof NumLeaf) {
      return new NumLeaf(tree.value);
    }
    else if (tree instanceof NegateNode) {
      return removeAllNegations(tree.subtree);
    }
    else {
      return new PlusNode(removeAllNegations(tree.leftSubtree), removeAllNegations(tree.rightSubtree));
    }
  }
}